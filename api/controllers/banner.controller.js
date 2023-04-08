const Banner = require("./../models/banner");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getBannersForAdmin = async (req, res) => {
  const banners = await Banner.find({});
  res.json({ status: true, data: banners });
};

module.exports.getBanners = async (req, res) => {
  const banners = await Banner.find({ is_viewable: true });
  res.json({ status: true, data: banners });
};

module.exports.createBanner = async (req, res) => {
  const banner = new Banner(req.body);
  banner.save((err, banner) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res
      .status(200)
      .json({ status: true, message: "Banner Successfully added" });
  });
};

module.exports.toggleBanner = async (req, res) => {
  const banner = await Banner.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!banner)
    return res.status(404).json({
      err: "Banner not found",
    });
  banner.is_viewable = !banner.is_viewable;
  await banner.save();
  return res
    .status(200)
    .json({ status: true, message: "Status successfully updated" });
};

module.exports.deleteBanner = async (req, res) => {
  await Banner.remove({ _id: ObjectId(req.params.id) });
  return res
    .status(200)
    .json({ status: true, message: "Banner successfully deleted" });
};
