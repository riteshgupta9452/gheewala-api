const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const dashboardRoutes = require("./dashboard.routes");

router.get('/', (req, res) => {
    return res.json({
        message: "Hello router"
    });
});

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;