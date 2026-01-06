const {
    CreateCategoryDTO,
    ErrorResDTO
} = require("../dtos/category.dto");
const CategoryService = require("../services/category.service");
const getToken = require("../utils/token/gettoken")

const CategoryController = {
    createCategory: async (req, res) => {
        try {
            const token = getToken(req)
            const dto = CreateCategoryDTO({
                ...req.body
            });

            const result = await CategoryService.CreateCategory(
                token,
                dto,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = CategoryController;