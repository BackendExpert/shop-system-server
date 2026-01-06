const Category = require("../models/category.model")

const verifyToken = require("../utils/token/verifyToken")
const checkuser = require("../utils/token/checkuser")
const logUserAction = require("../utils/others/logUserAction")

const {
    CreateCategoryResDTO
} = require("../dtos/category.dto")


class CategoryService {
    static async CreateCategory(token, dto, req) {
        const decoded = verifyToken(token)
        const user = await checkuser(decoded.email);

        dto.createdBy = user._id

        const category = new Category(dto);
        await category.save()

        if(req){
            await logUserAction(
                req,
                "CATEGORY CREATED",
                `${decoded.email} successfully created category ${dto.name}`,
                {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date()
                },
                user._id
            );

            return CreateCategoryResDTO()
        }

    }
}

module.exports = CategoryService    