const Admin = require("../models/admin");
const util = require("../functions/util");
const bcrypt = require("bcrypt");

module.exports.generatePassword = async (req, res) => {
  let admin = await Admin.findOne({});
  if (!admin) {
    admin = new Admin();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  admin.password = hash;
  admin.save((err, admin) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save admin in DB",
      });
    }
    res.json({
      message: "Password generated successfully",
      success: true,
    });
  });
};

module.exports.login = async (req, res) => {
  const admin = await Admin.findOne({});
  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword) {
    return res.status(400).json({
      err: "Invalid password",
    });
  }
  const token = util.generateJsonWebToken(admin);
  res.json({
    message: "Login successful",
    success: true,
    token: token,
  });
};
