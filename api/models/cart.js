const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "addresses",
    },
    products: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        product_total: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    promocode: {
      type: String,
      default: null,
    },
    discount: { type: Number, default: 0 },
    shiping_charges: {
      type: Number,
      default: 0,
    },
    payable: { type: Number, default: 0 },
    payment: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", cartSchema);
