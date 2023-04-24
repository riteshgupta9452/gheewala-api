const ProductCategory = require("./../models/product-category");
const ObjectId = require("mongoose").Types.ObjectId;
const Product = require("./../models/product");

module.exports.getCategoriesForUser = async (req, res) => {
  const categories = await ProductCategory.find({ is_viewable: true });
  res.json({ status: true, data: categories });
};

module.exports.getCategories = async (req, res) => {
  const categories = await ProductCategory.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
  ]);
  for (let index = 0; index < categories.length; index++) {
    categories[index].product_count = categories[index].products.length;
    delete categories[index].products;
  }
  res.json({ status: true, data: categories });
};

module.exports.getCategoryDetailForUser = async (req, res) => {
  const category = await ProductCategory.findOne({
    _id: ObjectId(req.params.id),
  });
  return res.json({ status: true, data: category });
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
  await category.save();
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

module.exports.deleteCategory = async (req, res) => {
  const products = await Product.findOne({ category: ObjectId(req.params.id) });
  if (products) {
    return res.status(400).json({
      err: "Cannot delete category",
    });
  }
  await ProductCategory.remove({
    _id: ObjectId(req.params.id),
  });
  return res
    .status(200)
    .json({ status: true, message: "Category successfully deleted" });
};
