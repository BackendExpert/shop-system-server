const bcrypt = require("bcrypt");
const MAX_ATTEMPTS = 5;

// models
const User = require("../models/user.model");
const Role = require("../models/role.model");
const UserOTP = require("../models/userotp.model");

// dtos
const {
    CreateAccountResDTO,
    CreateLoginResDTO,
    VerifyLoginResDTO
} = require("../dtos/auth.dto");

// utils
const { genarateOTP } = require("../utils/others/genarateOTP");
const generateToken = require("../utils/token/generateToken");
const verifyToken = require("../utils/token/verifyToken");
const { shouldResetAttempts } = require("../utils/logins/resetLoginAttempt");
const logUserAction = require("../utils/others/logUserAction");

// email templates
const CreateAccountEmail = require("../templates/CreateAccountEmail");
const notificationEmail = require("../templates/notificationEmail");

// security
const { calculateRiskScore, riskDecision } = require("../utils/security/riskEngine");
const { generateMFASecret, verifyMFAToken } = require("../utils/security/mfaService");

class AuthService {

    // =========================
    // CREATE AUTH (SEND OTP)
    // =========================
    static async createAuth(email, req) {

        const existingOTP = await UserOTP.findOne({ email });
        if (existingOTP) {
            throw new Error("OTP already sent. Check your email.");
        }

        let user = await User.findOne({ email });

        const otp = genarateOTP();
        const hashotp = await bcrypt.hash(otp, 10);

        await CreateAccountEmail(email, otp);

        await UserOTP.create({
            email,
            otp: hashotp
        });

        const otpToken = generateToken({ email }, "5min");

        // NEW USER
        if (!user) {
            const role = await Role.findOne({ name: "user" });
            if (!role) throw new Error("Default role not found");

            user = await User.create({
                email,
                role: role._id,
                isActive: true,
                isEmailVerified: false
            });

            await logUserAction(
                req,
                "REGISTER_OTP_SENT",
                "Registration OTP sent",
                this._meta(req),
                user._id
            );

            return CreateAccountResDTO(otpToken);
        }

        // EXISTING USER
        await logUserAction(
            req,
            "LOGIN_OTP_SENT",
            "Login OTP sent",
            this._meta(req),
            user._id
        );

        return CreateLoginResDTO(otpToken);
    }

    // =========================
    // VERIFY OTP + RISK CHECK
    // =========================
    static async verifyOTP(token, otp, req) {

        const decoded = verifyToken(token);
        const email = decoded.email;

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        if (shouldResetAttempts(user)) {
            user.login_attempt = 0;
            user.lastLoginAttemptAt = null;
            await user.save();
        }

        if (user.login_attempt >= MAX_ATTEMPTS) {
            throw new Error("Account temporarily locked");
        }

        const userOTP = await UserOTP.findOne({ email });
        if (!userOTP) {
            user.login_attempt++;
            await user.save();
            throw new Error("OTP expired or invalid");
        }

        const isValid = await bcrypt.compare(otp, userOTP.otp);
        if (!isValid) {
            user.login_attempt++;
            await user.save();
            throw new Error("Invalid OTP");
        }

        // =========================
        // FRAUD / RISK ENGINE
        // =========================
        const riskScore = calculateRiskScore({
            user,
            req,
            deviceId: req.headers["x-device-id"]
        });

        const decision = riskDecision(riskScore);

        await logUserAction(
            req,
            "RISK_EVALUATED",
            `Risk=${riskScore}, Decision=${decision}`,
            { riskScore, decision },
            user._id
        );

        // =========================
        // LOW RISK → ISSUE TOKEN
        // =========================
        if (decision === "LOW" && user.mfa?.enabled) {

            const role = await Role.findById(user.role);

            user.login_attempt = 0;
            user.lastLogin = new Date();
            user.lastLoginIp = this._ip(req);
            user.trustedDevices = user.trustedDevices || [];
            user.trustedDevices.push(req.headers["x-device-id"]);

            await user.save();
            await UserOTP.deleteOne({ email });

            const jwt = generateToken({
                id: user._id,
                email: user.email,
                role: role?.name
            }, "1d");

            await notificationEmail(email, "Login success");

            return VerifyLoginResDTO(jwt);
        }

        // =========================
        // REQUIRE MFA
        // =========================
        return {
            mfaRequired: true,
            mfaType: "AUTHENTICATOR_APP"
        };
    }

    // =========================
    // MFA ENROLL (QR CODE)
    // =========================
    static async enrollMFA(email, req) {

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const { base32, qrCode } = await generateMFASecret(email);

        user.mfa = {
            enabled: false,
            secret: base32
        };

        await user.save();

        await logUserAction(
            req,
            "MFA_ENROLLED",
            "Authenticator app enrolled",
            this._meta(req),
            user._id
        );

        return { qrCode };
    }

    // =========================
    // VERIFY MFA CODE
    // =========================
    static async verifyMFA(email, token, req) {

        const user = await User.findOne({ email });
        if (!user || !user.mfa?.secret) {
            throw new Error("MFA not configured");
        }

        const valid = verifyMFAToken(token, user.mfa.secret);
        if (!valid) throw new Error("Invalid MFA code");

        const role = await Role.findById(user.role);

        user.mfa.enabled = true;
        user.login_attempt = 0;
        user.lastLogin = new Date();
        user.lastLoginIp = this._ip(req);
        user.trustedDevices = user.trustedDevices || [];
        user.trustedDevices.push(req.headers["x-device-id"]);

        await user.save();

        const jwt = generateToken({
            id: user._id,
            email: user.email,
            role: role?.name
        }, "1d");

        await logUserAction(
            req,
            "MFA_SUCCESS",
            "MFA verification successful",
            this._meta(req),
            user._id
        );

        return VerifyLoginResDTO(jwt);
    }

    // =========================
    // HELPERS
    // =========================
    static _ip(req) {
        return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    }

    static _meta(req) {
        return {
            ipAddress: this._ip(req),
            userAgent: req.headers["user-agent"],
            timestamp: new Date()
        };
    }
}

module.exports = AuthService;
