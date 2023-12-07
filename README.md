# Serverless Photo Viewer Web Application

## Project Overview

This project is a serverless web application designed for a freelance photographer, to showcase and share his photos. Developed as per the recommendation of using AWS services, this application leverages various AWS components to ensure a cost-effective, scalable, and efficient solution.

### Key Features

- **Photo Upload and Management:** Admin users can upload photos with access restrictions. Public viewing is available if marked accordingly.
- **User Management:**   Users can sign up using Cognito's default UI and are automatically added to the User group by the postConfirmation function. Currently, to edit a user to an Admin, you need to do it manually through the console.
- **Simple UI:** Developed using React, providing a straightforward and simple user interface.
- **Serverless Backend with Cognito Authorizer:** Utilizes AWS Lambda with Node.js, ensuring scalability and cost-effectiveness.
- **Secure Authentication:** Integrated with Amazon Cognito for robust user authentication.
- **Cloud-Native Storage:** Photos are stored and retrieved from Amazon S3.
- **Database Management:** Utilizes Amazon DynamoDB for efficient data handling.

## Architecture
![Architecture Diagram](https://i.ibb.co/cvN3b1f/template.png)

The architecture diagram above provides a visual overview of how the application components interact within the AWS ecosystem.

## Technology Stack

- **Frontend:** React
- **Backend:** Node.js in AWS Lambda
- **Authentication:** Amazon Cognito
- **Database:** DynamoDB
- **Storage:** Amazon S3
- **Infrastructure as Code:** AWS CloudFormation with SAM CLI

## Deployment

This application is deployed using AWS Free Tier account. The infrastructure is managed and deployed using AWS SAM, which simplifies the process of building, packaging, and deploying serverless applications.

### Setting Up

 - **Prerequisites:** Ensure that you have an AWS account, AWS CLI and SAM cli configured on your machine.
 - **Deployment:** Use the provided CloudFormation template to set up the infrastructure.
 - **Commands:**  
	 - To build the application: `sam build`  
	 - To deploy the application: `sam deploy`
 - **Configuration:** Configure the environment variables as required for frontend.
	 - For frontend, create a .env file with
	
	    REACT_APP_AWS_USER_POOL_ID=ap-southeast-1_xxxxxxxx
        REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID=7xxxxxxxxxxxx
	
	These variables is use for the authentication with the Cognito user pool.
	
	- The CloudFormation template automatically creates two user groups, USER and ADMIN. However, to assign a user to the ADMIN group, manual updating via the console is required. By default, all new sign-ups are placed in the USER group.

## Usage

### Administrator

- **Uploading Photos:** Login as an admin to upload and manage photos.
- **Update Photo Public View Access:** Set the visibility of image to public
- **Delete Photo:** Remove selected photo.

### Users
- **Viewing Photos:** Users can view public photos after login.

## Repository Structure

- `/photo-viewer-app` - Contains all React frontend code.
- `/photo-viewer-backend` - Contains the AWS Lambda function code and CloudFormation template for setting up the infrastructure.

## Demo

### Comparison of Admin and User UI (Admin on the right)

![Comparison](https://i.ibb.co/26cMKHt/Comparison.gif)

### Viewable of Image
![Viewable](https://i.ibb.co/0GxD2dK/Viewable.gif)

### Delete Image
![Delete](https://i.ibb.co/DQjghLN/Delete.gif)

### Upload Image
![Upload](https://i.ibb.co/KVR3LVz/Untitled-Project-V1.gif)

## Author

- ***DaricOng***
