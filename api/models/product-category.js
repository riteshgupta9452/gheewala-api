const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productCategorySchema = new Schema(
  {
    label: String,
    icon: {
      type: String,
      default:
        "https://gheewala-bucket.s3.ap-south-1.amazonaws.com/Rectangle+46.svg",
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

module.exports = mongoose.model("categories", productCategorySchema);
