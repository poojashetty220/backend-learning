const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    const bucketName = 's3-upload-bucket-pooja';
    const { key, expiresIn = 300 } = JSON.parse(event.body || '{}');

    if (!bucketName || !key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: key' }),
      };
    }

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: parseInt(expiresIn), // in seconds
    };

    const signedUrl = s3.getSignedUrl('getObject', params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: signedUrl,
        expiresIn,
      }),
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate signed URL' }),
    };
  }
};
