const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');
const middleware = require('../functions/middleware');

router.get('/', middleware.tokenVerify, userController.getUser);
router.post('/register/:userType', userController.createUser);
router.get('/generate-otp/:mobile_no', userController.generateOtp);
router.get('/verify-otp/:otp/:mobile_no', userController.verifyOtp);
router.post('edit-profile', middleware.tokenVerify, userController.editUser);


module.exports = router;
