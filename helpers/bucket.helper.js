const {
    GetObjectCommand
} = require('@aws-sdk/client-s3');

const s3Client = require('../config/s3config');

exports.getObjectUrl = async (Key) => {
    const cammand = new GetObjectCommand({
        Bucket: 'sajal-test-bucket',
        Key: Key
    })

    const response = await s3Client.send(cammand);
    return response;
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