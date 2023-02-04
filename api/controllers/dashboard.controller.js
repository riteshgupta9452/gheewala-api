const Product = require('../models/product');
const ProductCategory = require("../models/product-category");
const User = require('../models/user');
const Cart = require('../models/cart');
const Address = require('../models/user-address');

module.exports.getDashboard = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    const categories = await ProductCategory.find().lean();

    if (!req.query.page || !req.query.limit) {
        return res.status(400).json({
            message: "page and limit are required"
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
            products: products.map(prod => ({ ...prod, price: prod.price[user.user_type] })),
            categories,
        },
    });
};

module.exports.addToCart = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    const product = await Product.findOne({ _id: req.params.product_id });

    if (!product) {
        return res.status(400).json({
            err: "Product not found"
        });
    }

    let cart = await Cart.findOne({ user: req.userId, status: 'pending' });

    if (!cart) {
        cart = await Cart.create({
            user: req.userId,
            products: [{
                product: product._id,
                quantity: 1,
            }],
            total: 0,
        });
    } else {
        if (cart.products.filter(el => el.product.toString() === product._id.toString()).length > 0) {
            return res.status(200).json({
                message: "Product already in cart"
            });
        }
        cart.products.push({
            product: product._id,
            quantity: 1,
        });
    }

    cart.total += product.price[user.user_type];

    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Product added to cart",
    });
};

module.exports.getCart = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    const cart = await Cart
        .findOne({ user: req.userId, status: "pending" })
        .populate('products.product address')
        .lean();

    if (!cart) {
        return res.status(200).json({
            success: false,
            data: {}
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            cart,
        }
    });
};

module.exports.updateCartProductQuantity = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    let quantityUpdate = await Cart
        .findOne({
            user: req.userId,
            status: "pending",
        });


    quantityUpdate.products = quantityUpdate.products.map(prod => {
        if (prod.product.toString() === req.params.product_id) {
            prod.quantity = req.params.quantity;
        }
        return prod;
    });
    
    await quantityUpdate.save();

    const cart = await Cart
        .findOne({ user: req.userId, status: "pending" })
        .populate('products.product address')
        .lean();

    let prodIdsToPul = cart.products
        .filter(prod => prod.quantity === 0)
        .map(el => el.product._id);

    await Cart.updateOne({
        user: req.userId,
        status: "pending",
    }, {
        $pull: {
            products: {
                product: {
                    $in: prodIdsToPul
                }
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Product quantity updated",
    });
};

module.exports.deleteCartProduct = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    await Cart.updateOne({
        user: req.userId,
        status: "pending",
    }, {
        $pull: {
            products: {
                product: req.params.product_id
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: "Product deleted",
    });
};

module.exports.checkout = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    const cart = await Cart
        .findOne({ user: req.userId, status: "pending" })
        .populate('products.product address')
        .lean();

    if (!cart) {
        return res.status(400).json({
            err: "Cart not found"
        });
    }

    if (cart.products.length === 0) {
        return res.status(400).json({
            err: "Cart is empty"
        });
    }

    if (!req.params.address_id) {
        return res.status(400).json({
            err: "Address not found"
        });
    }

    await Cart.updateOne({
        user: req.userId,
        status: "pending",
    }, {
        $set: {
            status: "processing",
            address: req.params.address_id,
        }
    });

    return res.status(200).json({
        success: true,
        message: "Order placed",
    });
};

module.exports.ship = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    if (!req.params.address_id) {
        return res.status(400).json({
            err: "Address not found"
        });
    }

    const cart = await Cart
        .findOne({ user: req.userId, status: "processing", address: req.params.address_id })
        .populate('products.product address')
        .lean();

    if (!cart) {
        return res.status(400).json({
            err: "Cart not found"
        });
    }

    if (cart.products.length === 0) {
        return res.status(400).json({
            err: "Cart is empty"
        });
    }

    await Cart.updateOne({
        user: req.userId,
        status: "processing",
        address: req.params.address_id,
    }, {
        $set: {
            status: "shipped",
        }
    });

    return res.status(200).json({
        success: true,
        message: "Order shipped",
    });
};

module.exports.deliver = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    if (!req.params.address_id) {
        return res.status(400).json({
            err: "Address not found"
        });
    }

    const cart = await Cart
        .findOne({ user: req.userId, status: "shipped", address: req.params.address_id })
        .populate('products.product address')
        .lean();

    if (!cart) {
        return res.status(400).json({
            err: "Cart not found"
        });
    }

    if (cart.products.length === 0) {
        return res.status(400).json({
            err: "Cart is empty"
        });
    }

    await Cart.updateOne({
        user: req.userId,
        status: "shipped",
        address: req.params.address_id,
    }, {
        $set: {
            status: "delivered",
        }
    });

    return res.status(200).json({
        success: true,
        message: "Order delivered",
    });
};

module.exports.getPreviousOrders = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    if (!req.query.page || !req.query.limit) {
        return res.status(400).json({
            message: "page and limit are required"
        });
    }

    const page = req.query.page;
    const limit = req.query.limit;
    const skipIndex = (page - 1) * limit;

    const status = req.params.status === "delivered" ? "delivered" : {
        $nin: ["pending", "delivered"]
    };
    
    const carts = await Cart
        .find({ user: req.userId, status })
        .populate('products.product')
        .sort({ createdAt: -1 })
        .skip(skipIndex)
        .limit(limit)
        .lean();

    if (!carts) {
        return res.status(400).json({
            err: "Carts not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Carts fetched",
        previousOrders: carts,
    });
};

// module.exports.seedCategories = async (req, res) => {
//     let cat = [
//         "Milk",
//         "Butter",
//         "Ghee",
//         "Cheese",
//         "Paneer",
//         "Curd",
//         "Yogurt",
//         "Khoa",
//         "Lassi"
//     ];

//     for (let i = 0; i < cat.length; i++) {
//         await ProductCategory.create({
//             label: cat[i],
//         });
//     }

//     return res.status(200).json({
//         success: true,
//         message: "Categories seeded successfully",
//     });
// };

// module.exports.seedProducts = async (req, res) => {
//     let products = [
//         {
//             "label": "A2 Milk",
//             "description": "Milk from A2 cows, known for its richer flavor and health benefits",
//             "subtext": "15 kg tin",
//             "images": [
//                 "https://example.com/a2-milk-1.jpg",
//                 "https://example.com/a2-milk-2.jpg"
//             ],
//             "price": {
//                 "b2b": 80,
//                 "b2c": 90
//             },
//             "category": "63d69b0e07c860d05e087064"
//         },
//         {
//             "label": "Organic Butter",
//             "description": "Butter made from the milk of grass-fed cows, free from hormones and preservatives",
//             "subtext": "200 gm pack",
//             "images": [
//                 "https://example.com/organic-butter-1.jpg",
//                 "https://example.com/organic-butter-2.jpg"
//             ],
//             "price": {
//                 "b2b": 100,
//                 "b2c": 120
//             },
//             "category": "63d69b0f07c860d05e087066"
//         },
//         {
//             "label": "Pure Ghee",
//             "description": "Traditional Indian clarified butter, made using the slow-cooking method",
//             "subtext": "500 gm jar",
//             "images": [
//                 "https://example.com/pure-ghee-1.jpg",
//                 "https://example.com/pure-ghee-2.jpg"
//             ],
//             "price": {
//                 "b2b": 150,
//                 "b2c": 170
//             },
//             "category": "63d69b0f07c860d05e087068"
//         },
//         {
//             "label": "Mozzarella Cheese",
//             "description": "Fresh and creamy cheese, perfect for pizzas and pastas",
//             "subtext": "250 gm pack",
//             "images": [
//                 "https://example.com/mozzarella-cheese-1.jpg",
//                 "https://example.com/mozzarella-cheese-2.jpg"
//             ],
//             "price": {
//                 "b2b": 150,
//                 "b2c": 170
//             },
//             "category": "63d69b1007c860d05e08706a"
//         },
//         {
//             "label": "Homemade Paneer",
//             "description": "Traditional Indian cheese, made using the freshest milk",
//             "subtext": "200 gm pack",
//             "images": [
//                 "https://example.com/homemade-paneer-1.jpg",
//                 "https://example.com/homemade-paneer-2.jpg"
//             ],
//             "price": {
//                 "b2b": 80,
//                 "b2c": 90
//             },
//             "category": "63d69b1107c860d05e08706c"
//         },
//         {
//             "label": "Pure Desi Ghee",
//             "description": "100% pure and natural ghee made from cow's milk",
//             "subtext": "1 kg tin",
//             "images": ["https://pureghee.jpeg", "https://pureghee2.jpeg"],
//             "price": {
//                 "b2b": 1500,
//                 "b2c": 1700
//             },
//             "category": "63d69b0f07c860d05e087068"
//         },
//         {
//             "label": "Organic Ghee",
//             "description": "Organically sourced ghee made from grass-fed cows",
//             "subtext": "500 gms jar",
//             "images": ["https://organicghee.jpeg", "https://organicghee2.jpeg"],
//             "price": {
//                 "b2b": 1000,
//                 "b2c": 1200
//             },
//             "category": "63d69b0f07c860d05e087068"
//         },
//         {
//             "label": "Clarified Butter Ghee",
//             "description": "Ghee made from clarified butter with a rich, buttery flavor",
//             "subtext": "250 gms jar",
//             "images": ["https://clarifiedbutterghee.jpeg", "https://clarifiedbutterghee2.jpeg"],
//             "price": {
//                 "b2b": 800,
//                 "b2c": 1000
//             },
//             "category": "63d69b0f07c860d05e087068"
//         },
//         {
//             "label": "A2 Ghee",
//             "description": "Ghee made from A2 cows' milk, known for its health benefits",
//             "subtext": "1 kg tin",
//             "images": ["https://a2ghee.jpeg", "https://a2ghee2.jpeg"],
//             "price": {
//                 "b2b": 1700,
//                 "b2c": 2000
//             },
//             "category": "63d69b0f07c860d05e087068"
//         },
//         {
//             "label": "Herbal Ghee",
//             "description": "Ghee infused with natural herbs for added health benefits",
//             "subtext": "500 gms jar",
//             "images": ["https://herbalghee.jpeg", "https://herbalghee2.jpeg"],
//             "price": {
//                 "b2b": 1000,
//                 "b2c": 1200
//             },
//             "category": "63d69b0f07c860d05e087068"
//         }
//     ];

//     for (let i = 0; i < products.length; i++) {
//         await Product.create({
//             label: products[i].label,
//             description: products[i].description,
//             subtext: products[i].subtext,
//             images: products[i].images,
//             price: products[i].price,
//             category: products[i].category,
//         });
//     }

//     return res.status(200).json({
//         success: true,
//         message: "Products seeded successfully",
//     });
// };
