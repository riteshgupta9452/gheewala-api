const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const bannerController = require("./../controllers/banner.controller");
const middleware = require("../functions/middleware");
const categoryController = require("./../controllers/category.controller");
const productController = require("./../controllers/product.controller");
const offerController = require("./../controllers/offer.controller");

router.post("/register/:userType", userController.createUser);
router.get("/generate-otp/:mobile_no", userController.generateOtp);
router.get("/verify-otp/:otp/:mobile_no", userController.verifyOtp);

router.use(middleware.tokenVerify);

router.get("/", userController.getUser);
router.post("/edit-profile", userController.editUser);

router.post("/address/:title", userController.addAddress);
router.put("/address/:address_id", userController.editAddress);
router.delete("/address/:address_id", userController.deleteAddress);
router.put("/address/:address_id/default", userController.setDefaultAddress);
router.get("/address", userController.getAddress);

// Banner
router.get("/banners", bannerController.getBanners);

// Categories
router.get("/categories", categoryController.getCategoriesForUser);
router.get("/category/:id", categoryController.getCategoryDetailForUser);
router.get("/products", productController.getProductsForUser);

// Offers
router.get("/offers", offerController.getOffers);
router.post("/offers/apply", offerController.applyOffer);
router.post("/offers/remove", offerController.removeOffer);
module.exports = router;
