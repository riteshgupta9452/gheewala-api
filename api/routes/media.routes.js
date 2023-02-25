const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const middleware = require('../functions/middleware');

const s3Service = require('../../services/aws/s3.service');

// router.use(middleware.tokenVerify);

router.post('/upload', middleware.singleFileUploadToBuffer, async (req, res) => {
  console.log(req.file);

  const fileName = Date.now() + '-' + req.file.originalname;
  const buffer = req.file.buffer;

  const data = await s3Service.uploadToS3(fileName, buffer);

  res.json({
    message: "File uploaded successfully",
    data,
  });
});

router.get('/download/:fileName', async (req, res) => await s3Service.streamGetObject(res, req.params.fileName));

module.exports = router;
