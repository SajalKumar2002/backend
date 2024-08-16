const {
    S3Client
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESSKEYID,
        secretAccessKey: process.env.S3_BUCKET_SECRETACCESSKEY
    }
})

module.exports = s3Client;