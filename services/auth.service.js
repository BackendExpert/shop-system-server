const bcrypt = require("bcrypt")

// models
const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userotp.model")

// dtos
const {
    CreateAccountResDTO,
    CreateLoginResDTO
} = require("../dtos/auth.dto")

// genrate otp util
const genarateOTP = require("../utils/others/genarateOTP")

// use actions
const logUserAction = require("../utils/others/logUserAction")

// templates
const CreateAccountEmail = require("../templates/CreateAccountEmail")

// genarate token
const generateToken = require("../utils/token/generateToken")

class AuthService {
    static async creatAuth(email) {
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

            return CreateAccountResDTO(token)
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

        return CreateLoginResDTO(token)


    }
}

module.exports = AuthService