const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");

router.get('/', (req, res) => {
    return res.json({
        message: "Hello router"
    });
});

router.use("/user", userRoutes);

module.exports = router;