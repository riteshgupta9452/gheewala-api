const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');
const middleware = require('../functions/middleware');

router.get('/', middleware.tokenVerify, userController.getUser);

router.post('/register/:userType', userController.createUser);
router.get('/generate-otp/:user_id', userController.generateOtp);
router.get('/verify-otp/:otp/:user_id', userController.verifyOtp);


module.exports = router;
