const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const generateMFASecret = async (email) => {
    const secret = speakeasy.generateSecret({
        name: `SecureAuth (${email})`
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
        base32: secret.base32,
        qrCode
    };
};

const verifyMFAToken = (token, secret) => {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1
    });
};

module.exports = { generateMFASecret, verifyMFAToken };
