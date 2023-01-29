const Product = require('../models/product');
const ProductCategory = require("../models/product-category");

module.exports.getDashboard = async (req, res) => {
    const categories = await ProductCategory.find().lean();

    if (!req.query.page || !req.query.limit) {
        return res.status(400).json({
            message: "Page and limit are required"
        });
    }

    const page = req.query.page;
    const limit = req.query.limit;
    const skipIndex = (page - 1) * limit;

    let query = {};

    if (req.query.text) {
        query = {
            ...query,
            label: {
                $regex: req.query.text,
                $options: "i"
            }
        };
    }

    if (req.params.category_id && req.params.category_id !== "all") {
        query = {
            ...query,
            category: req.params.category_id
        };
    }

    const products = await Product
        .find(query)
        .populate('category')
        .skip(skipIndex)
        .limit(limit)
        .lean();

    return res.status(200).json({
        success: true,
        data: {
            products,
            categories,
        },
    });
};