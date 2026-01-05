const jwt = require('jsonwebtoken');

const tokenCreator = (payload, time) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: time });
};

module.exports = tokenCreator;