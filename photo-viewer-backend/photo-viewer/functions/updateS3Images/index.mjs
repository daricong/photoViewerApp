import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  const { photoId } = JSON.parse(event.body);

  if (!photoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "photoId is required" }),
    };
  }

  try {
    //get current isPublic value
    const getParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { photoId },
    };
    const currentData = await dynamoDB.get(getParams).promise();

    if (!currentData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Image not found!" }),
      };
    }

    const isPublic = currentData.Item.isPublic;

    //perform update
    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { photoId },
      UpdateExpression: "set isPublic = :newVal",
      ExpressionAttributeValues: {
        ":newVal": !isPublic,
      },
    };
    await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: `Photo ${photoId} is Public set to ${!isPublic}`,
      }),
    };
  } catch (err) {
    console.error("Error toggling isPublic:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error toggling isPublic" }),
    };
  }
};
