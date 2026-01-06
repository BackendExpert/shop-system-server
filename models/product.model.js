const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        barcode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        sku: {
            type: String,
            unique: true,
            sparse: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        brand: {
            type: String,
            trim: true
        },

        costPrice: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        taxPercentage: {
            type: Number,
            default: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        minStockAlert: {
            type: Number,
            default: 5
        },

        batchNo: {
            type: String
        },

        expiryDate: {
            type: Date
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isDiscounted: {
            type: Boolean,
            default: false
        },

        discountPercentage: {
            type: Number,
            default: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", ProductSchema);
