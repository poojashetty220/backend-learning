const AWS = require("aws-sdk");
const {
  S3Client,
  GetObjectCommand,
} = require('@aws-sdk/client-s3')
const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

const s3_client = new S3Client()
const ddb_client = new DynamoDBClient({ region: 'ap-south-1' })

function csvToJson(csvString) {
  const lines = csvString.trim().split("\n"); // Split into lines
  const headers = lines[0].split(",").map(h => h.trim()); // Extract headers

  const jsonData = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || ""; // Assign value or empty string
    });
    return obj;
  });

  return jsonData;
}
const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = []
  stream.on('data', (chunk) => chunks.push(chunk))
  stream.on('error', reject)
  stream.on('end', () => resolve(Buffer.concat(chunks)))
})

async function getS3Object(bucket_name, file_name) {
  console.log(bucket_name, file_name)
  const s3_get_command = new GetObjectCommand({
    Bucket: bucket_name,
    Key: file_name,
  })
  const response = await s3_client.send(s3_get_command)
  return response
}

async function batchUpdate(products) {
  const result = await ddb_client.send(new BatchWriteItemCommand({
    RequestItems: {
      CsvDataTable: products.map((product) => ({
            PutRequest: {
                Item: marshall(product, { removeUndefinedValues: true }),
            },
        })),
    },
}))
return result
}

exports.handler = async (event) => {
  try {
    console.log("S3 Event:", JSON.stringify(event, null, 2));
    const { Body } = await getS3Object('s3-upload-bucket-pooja', 'uploads/products.csv')
    const csvStream = await streamToString(Body);
    console.log(csvToJson(csvStream.toString()));
    const batchResponse = await batchUpdate(csvToJson(csvStream.toString()));
    return batchResponse
  } catch (error) {
    console.log(error)
  }
  return batchResponse
};
