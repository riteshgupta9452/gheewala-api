const User = require('../models/user');

module.exports.createUser = async (req, res) => {
    const user = new User(req.body);
    req.body.user_type = req.params.userType;
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        res.json(user);
    });
};