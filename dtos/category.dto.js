// CREATE CATEGORY
exports.CreateCategoryDTO = (data) => ({
    name: data.name,
    code: data.code,
    description: data.description,
    parentCategory: data.parentCategory || null,
    createdBy: data.userId
});


// UPDATE CATEGORY
exports.UpdateCategoryDTO = (data) => ({
    name: data.name,
    description: data.description,
    parentCategory: data.parentCategory,
    isActive: data.isActive
});

// create category res dto
exports.CreateCategoryResDTO = (message="Category Created Success") => ({ success: true, result, message })

// update category res dto
exports.UpdateCategoryResDTO = (message="Category Updated Success") => ({ success: true, result, message })

// get all Categories res dto
exports.AllCategoryResDTO = (message="All Categories Fetched Successfully") => ({success: true, result, message })

// get one Category res dto
exports.OneCategoryResDTO = (message="One Category Fetched Successfully") => ({success: true, result, message })

// error res dto 
exports.ErrorResDTO = (message = "Something went wrong", code = "SERVER_ERROR") => ({
    success: false,
    error: {
        code,
        message
    },
    timestamp: Date.now()
});
