const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    address: {
      house_flat_no: { type: String, default: null },
      building_name: { type: String, default: null },
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      weekly_off: { type: String, default: null },
      open_time: { type: String, default: null },
      close_time: { type: String, default: null },
    },
    title: String,
    is_default: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("address", addressSchema);
