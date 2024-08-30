const {
    GetObjectCommand,
    DeleteObjectsCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const s3Client = require('../config/s3config');

exports.getObject = async (Key) => {
    const input = {
        Bucket: process.env.S3_BUCKET,
        Key: Key
    }

    const cammand = new GetObjectCommand(input);
    const response = await s3Client.send(cammand);

    return response;
}

exports.deleteObjects = async (array) => {

    const objectList = [];

    array.forEach(element => {
        objectList.push({
            Key: element.key
        })
    });

    const input = {
        Bucket: process.env.S3_BUCKET,
        Delete: {
            Objects: objectList
        }
    }

    const command = new DeleteObjectsCommand(input);
    s3Client.send(command);

    return;
}

exports.deleteObject = async (Key) => {
    const input = {
        Bucket: process.env.S3_BUCKET,
        Key: Key
    }

    const cammand = new DeleteObjectCommand(input);
    await s3Client.send(cammand);

    return;
}