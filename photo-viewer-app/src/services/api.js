import axios from "axios";
import { Auth } from "aws-amplify";

const API_ENDPOINT =
  "https://sjhmeeqdte.execute-api.ap-southeast-1.amazonaws.com";

axios.interceptors.request.use(async (config) => {
  try {
    const session = await Auth.currentSession();
    config.headers.Authorization = `Bearer ${session.idToken.jwtToken}`;
    // console.log(config.headers.Authorization);
  } catch (error) {
    console.error("Error getting token", error);
  }
  return config;
});

export const fetchImages = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/API/getImages`);
    const session = await Auth.currentSession();
    const isAdmin = session
      .getIdToken()
      .payload["cognito:groups"]?.includes("ADMIN");

    if (isAdmin) return response.data;
    else {
      console.log("Is User");
      //return only image that is pulicaccessible
      const publicImages = response.data.filter((image) => image.isPublic);
      return publicImages;
    }
  } catch (error) {
    console.error("error fetchImages", error);
  }
};

export const uploadImage = async (imageFile, metadata) => {
  // Convert the image file to a base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  try {
    const imageData = await toBase64(imageFile);
    const payload = {
      imageData: imageData,
      metadata: metadata,
    };

    const response = await axios.post(
      `${API_ENDPOINT}/API/uploadImages`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Or handle response as needed
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const updateImageVisibility = async ({ photoId }) => {
  // Implement the API call to your backend
  const payload = { photoId };

  try {
    const response = await axios.patch(
      `${API_ENDPOINT}/API/updateImages`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("error updateImageVisibility", error);
    throw error;
  }
};

export const deleteImage = async ({ photoId }) => {
  const payload = { photoId };

  try {
    const response = await axios.delete(`${API_ENDPOINT}/API/deleteImages`, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("error delete Images", error);
    throw error;
  }
};
