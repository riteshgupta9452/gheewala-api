const Paginator = require("./../../util/paginator");
const Order = require("./../models/cart");

module.exports.getOrders = async (req, res) => {
  const pipeline = [
    { $match: { status: "processing" } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  const orders = (
    await new Paginator(req.query.page)
      .setLimit(req.query.records_per_page)
      .run(Order, pipeline, { _id: -1 }, true)
  ).build();
  return res.status(200).json({ data: orders, success: true });
};
