const {
    GetObjectCommand,
    DeleteObjectsCommand
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = require('../config/s3config');
const { readUInt16LE } = require('tedious/lib/token/helpers');

exports.getObject = async (Key) => {
    const input = {
        Bucket: process.env.S3_BUCKET,
        Key: Key
    }

    const cammand = new GetObjectCommand(input);
    const response = await s3Client.send(cammand);

    return response;
}

exports.deleteObject = async (array) => {

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