const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    address: {
        house_flat_no: String,
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
}, {
    timestamps: true,
});

module.exports = mongoose.model('address', addressSchema);