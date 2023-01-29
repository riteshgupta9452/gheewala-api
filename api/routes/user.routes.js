const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');
const middleware = require('../functions/middleware');

router.post('/register/:userType', userController.createUser);
router.get('/generate-otp/:mobile_no', userController.generateOtp);
router.get('/verify-otp/:otp/:mobile_no', userController.verifyOtp);

router.use(middleware.tokenVerify);

router.get('/', userController.getUser);
router.post('/edit-profile', userController.editUser);

router.post('/address/:title', userController.addAddress);
router.put('/address/:address_id', userController.editAddress);
router.delete('/address/:address_id', userController.deleteAddress);
router.put('/address/:address_id/default', userController.setDefaultAddress);

module.exports = router;
