// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        // get token from header 
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        // decoded and verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = auth;
