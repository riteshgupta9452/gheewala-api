const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");
const categoryController = require("./../controllers/category.controller");
const orderController = require("./../controllers/order.controller");
const productController = require("./../controllers/product.controller");
const middleware = require("../functions/middleware");

router.post("/generate-password", adminController.generatePassword);
router.post("/login", adminController.login);

router.use(middleware.tokenVerify, (req, res, next) => {
  req.admin_id = req.userId;
  next();
});

router.get("/users", userController.getAllUsers);
router.get("/user-type", userController.getUserTypes);

router.get(
  "/user/:user_id",
  (req, res, next) => {
    req.userId = req.params.user_id;
    next();
  },
  userController.getUser
);

router.get("/toggle-verification/:user_id", userController.toggleVerification);

// Category
router.post("/category", categoryController.createCategory);
router.get("/categories", categoryController.getCategories);
router.get("/category/:id", categoryController.toggleCategory);

// Orders
router.get("/orders", orderController.getOrders);
// Products
router.get("/products", productController.getProducts);
router.post("/products", productController.createProduct);
router.get("/products/:id", productController.getProduct);
router.post("/products/:id", productController.editProduct);
module.exports = router;
