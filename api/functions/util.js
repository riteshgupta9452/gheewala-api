// generate 4 digit number string
module.exports.generateOtp = () => 
    Math.floor(1000 + Math.random() * 9000);

module.exports.generateTestOtp = () => 1234;
