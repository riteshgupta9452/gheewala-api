const User = require('../models/user');
const util = require('../functions/util');

module.exports.createUser = async (req, res) => {
    req.body.user_type = req.params.userType;
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        res.json(user);
    });
};

module.exports.generateOtp = async (req, res) => {
    const user = await User.findOne({ _id: req.params.user_id });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    const otp = util.generateTestOtp();
    user.otp_verified = false;
    user.otp = otp;

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        console.log(user);
        res.json({
            message: "OTP generated successfully",
            success: true,
        });
    });
};


module.exports.verifyOtp = async (req, res) => {
    const user = await User.findOne({ _id: req.params.user_id });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    if (user.otp === req.params.otp && user.verified) {
        user.otp_verified = true;
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    err: "NOT able to save user in DB"
                });
            }
            return res.json({
                message: "OTP verified successfully",
                success: true,
                token: util.generateJsonWebToken(user),
            });
        });
    } else
        return res.json({
            message: "OTP verification failed",
            success: false,
        });
};

module.exports.getUser = async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json({
            err: "User not found"
        });
    }

    return res.json({
        user: user,
        success: true,
    });
};
