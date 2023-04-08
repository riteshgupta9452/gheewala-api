const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dashboardSchema = new Schema(
  {
    title: { type: String, default: "no-name" },
    products: [{ type: Schema.Types.ObjectId, ref: "products" }],
    is_viewable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("dashboard", dashboardSchema);
