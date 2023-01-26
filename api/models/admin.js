const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        default: "admin",
    },
    password: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('admin', userSchema);