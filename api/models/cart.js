const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'addresses',
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending',
    },
    payment: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);