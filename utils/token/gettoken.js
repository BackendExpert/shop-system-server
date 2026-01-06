function getToken(req) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new Error("Access denied: token missing");
    }
    return token;
}

module.exports = getToken;