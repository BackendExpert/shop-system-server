const User = require("../models/user.model")

const verifyToken = require("../utils/token/verifyToken")
const checkuser = require("../utils/token/checkuser")


class CategoryService {
    static async CreateCategory(token, dto, req) {
        const decoded = verifyToken(token)
        const user = await checkuser(decoded.email);

        
    }
}

module.exports = CategoryService    