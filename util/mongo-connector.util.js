const mongoose = require('mongoose');
const config = require('../config');

module.exports = {
    connect: async () => {
        mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}