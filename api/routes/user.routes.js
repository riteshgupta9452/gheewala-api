const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/', (req, res) => {
    res.json({
        mesaage: "User Route" 
    });
});

router.post('/register/:userType', userController.createUser);

module.exports = router;