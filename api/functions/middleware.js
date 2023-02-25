const jwt = require('jsonwebtoken');
const multer = require('multer');

module.exports.tokenVerify = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({
            message: "No token provided"
        });
    }
    jwt.verify(token, "ggwp", (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        req.userId = decoded._id;
        next();
    });
};

module.exports.singleFileUploadToBuffer = (req, res, next) => {
    const upload = multer({ storage: multer.memoryStorage() }).single('file');
    upload(req, res, (err) => {
        console.log(err);
        if (err) {
            return res.status(500).json({
                message: "Error while uploading file"
            });
        }
        next();
    });
};
