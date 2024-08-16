const multer = require('multer')
const multerS3 = require('multer-s3')
const s3Client = require('./s3config');

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

module.exports = {
    upload
};