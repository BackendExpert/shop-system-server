const rateLimit = require("express-rate-limit");
const User = require("../models/user.model"); // adjust path if needed
const Role = require("../models/role.model");
const jwt = require("jsonwebtoken");

const limiter = rateLimit({
    windowMs: 15 * 60 * 10000, 
    max: 1000, 
});

// in this middleware headle the ratelimilting for all users
// in development admin can access freely system without ratelimiting
// no effect by this middelware 

async function conditionalRateLimit(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader) return limiter(req, res, next); // apply limiter if no token

        const token = authHeader.split(" ")[1];
        if (!token) return limiter(req, res, next);

        // Verify token (example using JWT)
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate("role");

        if (!user) return limiter(req, res, next);

        // If admin, skip rate limit 
        if (user.role && user.role.name === "admin") {
            return next();
        }

        // Otherwise apply rate limiter
        return limiter(req, res, next);
    } catch (err) {
        console.error("Rate limit check failed:", err);
        return limiter(req, res, next); // fallback to limiter
    }
}

module.exports = conditionalRateLimit;
