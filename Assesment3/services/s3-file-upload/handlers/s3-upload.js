const AWS = require('aws-sdk');
const mime = require('mime-types');

const s3 = new AWS.S3({ region: 'ap-south-1' });

const BUCKET_NAME = 's3-upload-bucket-pooja';
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileContentBase64 } = body;

    if (!fileName || !fileContentBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing fileName or fileContentBase64' }),
      };
    }

    const fileExt = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Invalid file type: ${fileExt}` }),
      };
    }

    const buffer = Buffer.from(fileContentBase64, 'base64');
    const contentType = mime.lookup(fileExt) || 'application/octet-stream';

    const key = `uploads/${Date.now()}_${fileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      StorageClass: 'STANDARD_IA',
      Metadata: {
        uploadedBy: 'lambda-handler',
        originalName: fileName,
      }
    };

    const result = await s3.upload(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Upload successful',
        url: result.Location,
        key: result.Key
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Upload failed', error: error.message }),
    };
  }
};
