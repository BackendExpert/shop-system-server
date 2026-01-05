const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, trim: true },
    username: { type: String, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
    login_attempt: { type: Number, default: 0 },
    lastLoginAttemptAt: { type: Date },
    lastLogin: Date,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;