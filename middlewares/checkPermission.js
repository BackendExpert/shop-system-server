// middlewares/checkPermission.js
const Role = require("../models/role.model");
const User = require('../models/user.model')

const jwt = require("jsonwebtoken");

/**
 * Middleware to check permissions for a route.
 */
const checkPermission = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            // 1. Check token
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            // 2. Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 

            // 3. Fetch user's role permissions
            const roleDoc = await Role.findOne({ name: decoded.role });
            if (!roleDoc) {
                return res.status(403).json({ message: "Role not found" });
            }

            let userPermissions = roleDoc.permissions || [];


            // 5. Check if user has all required permissions
            const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
            if (!hasPermission) {
                return res.status(403).json({ message: "Access denied: insufficient permissions" });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: "Permission check failed", error: err.message });
        }
    };
};

module.exports = checkPermission;
