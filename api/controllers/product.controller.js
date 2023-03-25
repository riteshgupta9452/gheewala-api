const Paginator = require("./../../util/paginator");
const Product = require("./../models/product");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getProducts = async (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
  ];
  const products = (
    await new Paginator(req.query.page)
      .setLimit(req.query.records_per_page)
      .run(Product, pipeline, { _id: -1 }, true)
  ).build();
  return res.status(200).json({ data: products, success: true });
};

module.exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ _id: ObjectId(req.params.id) });
  if (!product) {
    return res.status(400).json({
      err: "Product not found",
    });
  }
  return res.status(200).json({ status: true, data: product });
};

module.exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res
      .status(200)
      .json({ status: true, message: "Product Successfully created" });
  });
};

module.exports.editProduct = async (req, res) => {
  const product = await Product.findOne({ _id: ObjectId(req.params.id) });

  if (!product) {
    return res.status(400).json({
      err: "Product not found",
    });
  }

  Object.keys(req.body).forEach((key) => {
    product[key] = req.body[key];
  });

  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json(product);
  });
};
