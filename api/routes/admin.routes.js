const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");
const categoryController = require("./../controllers/category.controller");
const orderController = require("./../controllers/order.controller");
const productController = require("./../controllers/product.controller");
const bannerController = require("./../controllers/banner.controller");
const dashboardController = require("./../controllers/dashboard.controller");
const middleware = require("../functions/middleware");

router.post("/generate-password", adminController.generatePassword);
router.post("/login", adminController.login);

router.use(middleware.adminTokenVerify, (req, res, next) => {
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

// Banner
router.post("/banners", bannerController.createBanner);
router.get("/banners", bannerController.getBannersForAdmin);
router.put("/banners/status/:id", bannerController.toggleBanner);
router.delete("/banners/:id", bannerController.deleteBanner);

//App Dashboard
router.post("/app-dashboard", dashboardController.createDashboardCategory);
router.get("/app-dashboard", dashboardController.getDashboardCategoryForAdmin);
router.put(
  "/app-dashboard/status/:id",
  dashboardController.toggleDashboardCategory
);
router.put("/app-dashboard/:id", dashboardController.updateDashboardProducts);
router.delete(
  "/app-dashboard/:id",
  dashboardController.deleteDashboardCategory
);
router.get(
  "/app-dashboard/:id",
  dashboardController.getDashboardCategoryDetailsForAdmin
);
module.exports = router;
