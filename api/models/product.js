const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    label: String,
    description: String,
    subtext: String,
    images: [String],
    image: String,
    inventory: Number,
    price: {
      b2b: Number,
      "b2b-1": Number,
      "b2b-2": Number,
      "b2b-3": Number,
      "b2b-4": Number,
      "b2b-5": Number,
      "b2b-6": Number,
      "b2b-7": Number,
      "b2b-8": Number,
      "b2b-9": Number,
      "b2b-10": Number,
      "b2b-11": Number,
      "b2b-12": Number,
      "b2b-13": Number,
      "b2b-14": Number,
      "b2b-15": Number,
      "b2b-16": Number,
      "b2b-17": Number,
      "b2b-18": Number,
      b2c: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    is_viewable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("products", productSchema);
