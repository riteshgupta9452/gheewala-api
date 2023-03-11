const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");
const categoryController = require("./../controllers/category.controller");
const orderController = require("./../controllers/order.controller");
const middleware = require("../functions/middleware");

router.post("/generate-password", adminController.generatePassword);
router.post("/login", adminController.login);

router.use(middleware.tokenVerify, (req, res, next) => {
  req.admin_id = req.userId;
  next();
});

router.get("/users", userController.getAllUsers);

router.get(
  "/user/:user_id",
  (req, res, next) => {
    req.userId = req.params.user_id;
    next();
  },
  userController.getUser
);

router.get("/toggle-verification/:user_id", userController.toggleVerification);
router.get("/categories", categoryController.getCategories);
router.get("/category/:id", categoryController.toggleCategory);
router.get("/orders", orderController.getOrders);

module.exports = router;
