const AWS = require('aws-sdk');
const config = require('../config');

module.exports = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
});