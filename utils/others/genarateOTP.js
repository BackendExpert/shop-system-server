const crypto = require("crypto")

exports.genarateOTP = (length = 8) => {
    return crypto
        .randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);
}