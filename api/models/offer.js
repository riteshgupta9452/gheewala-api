const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const offerSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    offer_type: { type: String, default: "percentage" },
    offer_value: { type: Number, required: true },
    upto: { type: String, default: null },
    only_for_one_time: { type: Boolean, default: false },
    is_viewable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("offers", offerSchema);
