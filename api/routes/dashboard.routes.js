const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const middleware = require('../functions/middleware');

router.use(middleware.tokenVerify);

router.get('/:category_id', dashboardController.getDashboard);

module.exports = router;
