// deleteImageHandler.js
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

export const handler = async (event) => {
  const { photoId } = JSON.parse(event.body);

  if (!photoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "photoId is required" }),
    };
  }

  try {
    // Check if the image exists in DynamoDB
    const getParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { photoId },
    };
    const { Item } = await dynamoDB.get(getParams).promise();

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Image not found" }),
      };
    }

    // Delete from DynamoDB
    await dynamoDB.delete(getParams).promise();

    // Delete from S3
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: photoId,
    };
    await s3.deleteObject(s3Params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: `Image photoId=${photoId} deleted successfully`,
      }),
    };
  } catch (err) {
    console.error(`Error deleting image photoId=${photoId}:`, err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error deleting image" }),
    };
  }
};
