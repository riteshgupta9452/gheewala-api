require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGO_URI,
}