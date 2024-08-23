const {
    GetObjectCommand,
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = require('../config/s3config');

exports.getObjectUrl = async (Key) => {
    const cammand = new GetObjectCommand({
        Bucket: 'sajal-test-bucket',
        Key: Key
    })

    const url = await getSignedUrl(s3Client, cammand)
    return url;
}

exports.getObject = async (Key) => {
    const input = {
        Bucket: 'sajal-test-bucket',
        Key: Key
    }

    const cammand = new GetObjectCommand(input);
    const response = await s3Client.send(cammand);

    return response;
}