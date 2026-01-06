// CREATE PRODUCT
exports.CreateProductDTO = (data) => ({
    name: data.name,
    barcode: data.barcode,
    sku: data.sku,
    category: data.category,
    brand: data.brand,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    taxPercentage: data.taxPercentage,
    quantity: data.quantity,
    minStockAlert: data.minStockAlert,
    batchNo: data.batchNo,
    expiryDate: data.expiryDate,
    isDiscounted: data.isDiscounted,
    discountPercentage: data.discountPercentage,
    images: data.images,
});


// UPDATE PRODUCT
exports.UpdateProductDTO = (data) => ({
    name: data.name,
    category: data.category,
    brand: data.brand,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    taxPercentage: data.taxPercentage,
    quantity: data.quantity,
    minStockAlert: data.minStockAlert,
    batchNo: data.batchNo,
    expiryDate: data.expiryDate,
    isDiscounted: data.isDiscounted,
    discountPercentage: data.discountPercentage,
    isActive: data.isActive,
    images: data.images,
});

// create product res dto 
exports.CreateProductResDTO = (message="Product Created Successfully") => ({ success: true, message })

// update product res dto
exports.UpdateProductResDTO = (message="Product Updated Successfully") => ({ success: true, message })


// get all products res dto
exports.AllProductsResDTO = (message="All Products Fetched Successfully") => ({success: true, result, message })

// get one product res dto
exports.OneProductResDTO = (message="One Products Fetched Successfully") => ({success: true, result, message })

// error res dto

exports.ErrorResDTO = (message = "Something went wrong", code = "SERVER_ERROR") => ({
    success: false,
    error: {
        code,
        message
    },
    timestamp: Date.now()
});
