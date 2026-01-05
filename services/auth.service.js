const bcrypt = require("bcrypt")
const MAX_ATTEMPTS = 5;

// models
const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userotp.model")

// dtos
const {
    CreateAccountResDTO,
    CreateLoginResDTO,
    VerifyLoginResDTO
} = require("../dtos/auth.dto")

// genrate otp util
const genarateOTP = require("../utils/others/genarateOTP")

// verify Token
const verifyToken = require("../utils/token/verifyToken")

// login apptempt reset 
const resetloginattempts = require("../utils/logins/resetLoginAttempt")

// use actions
const logUserAction = require("../utils/others/logUserAction")

// templates
const CreateAccountEmail = require("../templates/CreateAccountEmail")
const notificationEmail = require("../templates/notificationEmail")

// genarate token
const generateToken = require("../utils/token/generateToken")

class AuthService {
    static async createAuth(email, req) {
        const user = await User.findOne({ email: email })
        const userotp = await UserOTP.findOne({ email: email })

        if (userotp) {
            throw new Error("OPT Already Sent, Check your email")
        }

        const otp = genarateOTP(8)
        const hashotp = await bcrypt.hash(otp, 10)

        await CreateAccountEmail(email, otp)

        await UserOTP.create({
            email,
            otp: hashotp
        })

        const otptoken = generateToken(
            {
                email: user.email,
            },
            '5min'
        )

        if (!user) {
            const role = await Role.findOne({ name: "user" });
            if (!role) throw new Error("Default role not found");

            const newUser = await User.create({
                email,
                role: role._id,
                isActive: true,
                isEmailVerified: false
            });

            if (req) {
                await logUserAction(
                    req,
                    "REGISTER_OTP_SENT",
                    `${email} registration OTP sent`,
                    {
                        ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                        userAgent: req.headers["user-agent"],
                        timestamp: new Date()
                    },
                    newUser._id
                );
            }

            return CreateAccountResDTO(otptoken)
        }
        if (req) {
            await logUserAction(
                req,
                "LOGIN_OTP_SENT",
                `${email} login OTP sent`,
                {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date()
                },
                user._id
            );
        }

        return CreateLoginResDTO(otptoken)
    }

    static async verifyOTP(email, otp, req) {
        const decoded = verifyToken(token);
        const email = decoded.email;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        if (resetloginattempts(user)) {
            user.login_attempt = 0;
            user.lastLoginAttemptAt = null;
            await user.save();
        }

        if (user.login_attempt >= MAX_ATTEMPTS) {
            throw new Error("Account temporarily locked. Try again after 15 minutes");
        }



        const checkotp = await UserOTP.findOne({ email });
        if (!checkotp || !checkotp.otp) {
            user.login_attempt += 1;
            user.lastLoginAttemptAt = new Date();
            await user.save();
            await logUserAction(
                req,
                "LOGIN_ATTEMPT_FAILED",
                `${email} Login Attempt Failed, OTP not found or expired`,
                {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date()
                },
                user._id
            );

            throw new Error("OTP expired or invalid. Please request a new one.");
        }

        const isOtpValid = await bcrypt.compare(otp, checkotp.otp);
        if (!isOtpValid) {
            user.login_attempt += 1;
            user.lastLoginAttemptAt = new Date();
            await user.save();
            await logUserAction(
                req,
                "LOGIN_ATTEMPT_FAILED",
                `${email} Login Attempt Failed, Wrong OTP`,
                {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date()
                },
                user._id
            );

            throw new Error("Invalid OTP");
        }

        const getuserrole = await Role.findById(user.role);

        const token = tokenCreator(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: getuserrole?.name,
            },
            "1d"
        );

        const metadata = {
            ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            userAgent: req.headers["user-agent"],
            timestamp: new Date().toLocaleString()
        };

        await logUserAction(
            req,
            "LOGIN_ATTEMPT_SUCCESS",
            `${email} Login Attempt Success`,
            metadata,
            user._id
        );

        user.login_attempt = 0;
        user.lastLoginAttemptAt = null;

        user.lastLogin = new Date();
        await user.save();

        const notification = "Login Success at " + user.lastLogin
        await notificationEmail(email, notification)

        await UserOTP.deleteOne({ email });

        return VerifyLoginResDTO(token);

    }
}

module.exports = AuthService