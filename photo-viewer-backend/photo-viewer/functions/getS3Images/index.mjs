// getPublicImagesHandler.js
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

export const handler = async () => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      //   FilterExpression: "isPublic = :val",
      //   ExpressionAttributeValues: { ":val": true },
    };
    const data = await dynamoDB.scan(params).promise();

    const imagesWithUrls = await Promise.all(
      data.Items.map(async (item) => {
        const url = s3.getSignedUrl("getObject", {
          Bucket: process.env.BUCKET_NAME,
          Key: item.photoId,
          Expires: 20 * 60, // URL expires in 20 minutes
        });
        return { ...item, url };
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(imagesWithUrls),
    };
  } catch (err) {
    console.error("Error fetching public images:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching public images" }),
    };
  }
};
