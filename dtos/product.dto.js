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
    createdBy: data.userId
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
    isActive: data.isActive
});


// RESPONSE DTO (SAFE FOR FRONTEND)
exports.ProductResDTO = (product) => ({
    id: product._id,
    name: product.name,
    barcode: product.barcode,
    sku: product.sku,
    category: product.category,
    brand: product.brand,
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    taxPercentage: product.taxPercentage,
    quantity: product.quantity,
    minStockAlert: product.minStockAlert,
    batchNo: product.batchNo,
    expiryDate: product.expiryDate,
    isActive: product.isActive,
    isDiscounted: product.isDiscounted,
    discountPercentage: product.discountPercentage,
    createdAt: product.createdAt
});
