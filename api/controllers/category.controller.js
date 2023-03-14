const ProductCategory = require("./../models/product-category");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getCategories = async (req, res) => {
  const categories = await ProductCategory.find({});
  res.json({ status: true, data: categories });
};

module.exports.toggleCategory = async (req, res) => {
  const category = await ProductCategory.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!category)
    return res.status(404).json({
      err: "Category not found",
    });
  category.is_viewable = !category.is_viewable;
  category.save();
  return res
    .status(200)
    .json({ status: true, message: "Status successfully updated" });
};

module.exports.createCategory = async (req, res) => {
  const category = new ProductCategory(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res
      .status(200)
      .json({ status: true, message: "Category successfully created" });
  });
};
