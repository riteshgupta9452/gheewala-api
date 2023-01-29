const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const middleware = require('../functions/middleware');

// router.get("/category-seeder", dashboardController.seedCategories);
// router.get("/product-seeder", dashboardController.seedProducts);

router.use(middleware.tokenVerify);

router.get('/:category_id', dashboardController.getDashboard);


module.exports = router;
