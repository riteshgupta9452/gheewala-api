const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productCategorySchema = new Schema({
    label: String,
    is_viewable: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('categories', productCategorySchema);