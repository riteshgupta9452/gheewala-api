const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    phone_number: String,
    user_type: {
        type: String,
        enum: ["b2b", "b2c"],
    },
    firm_name: String,
    shop_unit: String,
    building_name: String,
    street_area: String,
    city: String,
    state: String,
    pincode: String,
    primary_contact: String,
    secondary_contact: String,
    gst_registration: String,
    gst_image_url: String,
    fssai_registration: String,
    fssai_image_url: String,
    verified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('users', userSchema);