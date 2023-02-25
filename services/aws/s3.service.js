const s3 = require("../../util/aws-s3.util");

module.exports.uploadToS3 = async (fileName, buffer) => {
  const params = {
    Bucket: "gheewala-bkt",
    Key: fileName,
    Body: buffer,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports.getS3Object = async (fileName) => {
  const params = {
    Bucket: "gheewala-bkt",
    Key: fileName,
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports.streamGetObject = async (res, key, bucketName = "gheewala-bkt") => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error retrieving S3 object');
    }
    res.setHeader('Content-Type', data.ContentType);
    res.send(data.Body);
  });
}