const jwt = require("jsonwebtoken");

function verifyToken(token) {
    if (!token) {
        throw new Error("Token missing");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        throw new Error("Invalid or expired token");
    }
}

module.exports = verifyToken;
