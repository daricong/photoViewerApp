import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to upload image to S3
async function uploadImageToS3(imageBuffer, imageId, type) {
  try {
    const key = `${imageId}.${type.ext}`;
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${imageId}.${type.ext}`,
      Body: imageBuffer,
      ContentType: type.mime,
    };
    await s3.putObject(s3Params).promise();
    return key;
  } catch (err) {
    console.error(
      `Error occur when uploading Image to S3 imageId=${imageId}: ${err.message}`
    );
    throw new Error("Error uploading Image");
  }
}

// Function to save metadata to DynamoDB
async function saveMetadataToDynamoDB(imageKey, metadata) {
  try {
    const createTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    });
    const dbParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        photoId: imageKey,
        createTime: createTime,
        isPublic: true,
        ...metadata,
      },
    };
    await dynamoDB.put(dbParams).promise();
  } catch (err) {
    console.error(
      `Error occur when saving metadata to DynamoDB imageKey=${imageKey}: ${err.message}`
    );
    throw new Error("Error occur save records to dynamoDB");
  }
}

export const handler = async (event) => {
  try {
    const { imageData, metadata } = JSON.parse(event.body);

    // Basic input validation
    if (!imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Image data is required" }),
      };
    }

    // Decode base64 and get file type
    const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
    const type = await fileTypeFromBuffer(imageBuffer);
    if (!type || !["png", "jpg", "jpeg", "gif"].includes(type.ext)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Unsupported file type" }),
      };
    }

    const imageId = uuidv4();

    const imageKey = await uploadImageToS3(imageBuffer, imageId, type);
    await saveMetadataToDynamoDB(imageKey, metadata);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: `Image:${imageKey} upload Successfully`,
      }),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};
