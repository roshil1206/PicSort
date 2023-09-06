const AWS = require("./AWS");
const { getFileExtension } = require("./functions");

const s3 = new AWS.S3();

const uploadFile = async (path, file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: path + getFileExtension(file.originalname),
    Body: file.buffer,
  };
  return await s3.upload(params).promise();
};

const fetchFile = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };
  return await s3.getObject(params).promise();
};

module.exports = { uploadFile, fetchFile };
