import AWS from "aws-sdk";
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
  const listUserPoolsResult = await cognitoIdp
    .listUserPools({ MaxResults: 60 })
    .promise();
  const userPools = listUserPoolsResult.UserPools;

  // Find User Pool by name
  const userPoolName = "photo-viewer-user-pool";
  const userPool = userPools.find((pool) => pool.Name === userPoolName);

  if (!userPool) {
    throw new Error(`User Pool "${userPoolName}" not found`);
  }

  // Now you have the User Pool ID
  const userPoolId = userPool.Id;

  const params = {
    GroupName: "USER",
    UserPoolId: userPoolId,
    Username: event.userName,
  };

  try {
    await cognitoIdp.adminAddUserToGroup(params).promise();
    console.log(`User ${event.userName} added to group ${params.GroupName}`);
  } catch (error) {
    console.error(`Error adding user to group: ${error}`);
    throw error;
  }

  return event;
};
