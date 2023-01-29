const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    label: String,
    description: String,
    subtext: String,
    images: [String],
    price: {
        b2b: Number,
        b2c: Number,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
    },
    is_viewable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', productSchema);