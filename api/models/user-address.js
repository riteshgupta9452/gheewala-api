const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    address: {
        house_flat_no: String,
        building_name: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    title: String,
    is_default: {
        type: Boolean,
        default: false,
    },
    is_viewable: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('address', addressSchema);