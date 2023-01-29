const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const middleware = require('../functions/middleware');

// router.get("/category-seeder", dashboardController.seedCategories);
// router.get("/product-seeder", dashboardController.seedProducts);

router.use(middleware.tokenVerify);

router.get('/:category_id', dashboardController.getDashboard);

router.post('/cart/:product_id', dashboardController.addToCart);
router.get('/cart', dashboardController.getCart);
router.put('/cart/:product_id/:quantity', dashboardController.updateCartProductQuantity);
router.delete('/cart/:product_id', dashboardController.deleteCartProduct);

router.get('/checkout/:address_id', dashboardController.checkout);
router.get('/ship/:address_id', dashboardController.ship);
router.get('/deliver/:address_id', dashboardController.deliver);

module.exports = router;
