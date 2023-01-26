const jwt = require('jsonwebtoken');

module.exports.generateOtp = () => 
    Math.floor(1000 + Math.random() * 9000);

module.exports.generateTestOtp = () => 1234;

module.exports.generateJsonWebToken = (user) => {
    const token = jwt.sign({ _id: user._id }, "ggwp");
    return token;
};