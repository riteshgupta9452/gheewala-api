const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");

router.get('/', (req, res) => {
    return res.json({
        message: "Hello router"
    });
});

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

module.exports = router;