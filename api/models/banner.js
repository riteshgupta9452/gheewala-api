const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bannerSchema = new Schema(
  {
    banner: String,
    priority: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("banners", bannerSchema);
