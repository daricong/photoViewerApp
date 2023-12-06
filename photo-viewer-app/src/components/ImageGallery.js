import React, { useState, useEffect } from "react";
import {
  fetchImages,
  updateImageVisibility,
  deleteImage,
} from "../services/api";
import { Auth } from "aws-amplify";
import { FaTrash } from "react-icons/fa";
import "./css/imageGallery.css";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({});
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [deleteNotification, setDeleteNotification] = useState(null); // State for delete notification message

  useEffect(() => {
    const loadImagesAndCheckRole = async () => {
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);

        const session = await Auth.currentSession();
        const groups = session.getIdToken().payload["cognito:groups"] || [];
        setIsAdmin(groups.includes("ADMIN"));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadImagesAndCheckRole();
  }, []);

  const handleCheckboxChange = async (image) => {
    try {
      const updatedImage = { ...image, isPublic: !image.isPublic };
      await updateImageVisibility({ photoId: updatedImage.photoId });

      setImages(
        images.map((img) =>
          img.photoId === image.photoId ? updatedImage : img
        )
      );
      setUpdateStatus({ ...updateStatus, [image.photoId]: "Status updated" });

      // Optionally, clear the status message after a few seconds
      setTimeout(() => {
        setUpdateStatus({ ...updateStatus, [image.photoId]: "" });
      }, 2000);
    } catch (error) {
      console.error("Error updating image visibility:", error);
      setUpdateStatus({
        ...updateStatus,
        [image.photoId]: "Error updating status",
      });
    }
  };

  const handleDeleteClick = (image) => {
    setDeleteImageId(image.photoId);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteImage({ photoId: deleteImageId });
      // Filter out the deleted image from the images state
      setImages(images.filter((image) => image.photoId !== deleteImageId));

      // Show the delete notification
      setDeleteNotification("Image deleted");

      // Close the confirmation dialog
      setDeleteImageId(null);

      // Clear the delete notification after a few seconds
      setTimeout(() => {
        setDeleteNotification(null);
      }, 2000);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Photo Gallery</h1>
      <div className="image-gallery">
        {images.map((image) => (
          <div key={image.photoId} className="image-item">
            <img src={image.url} alt={image.title} className="image" />
            <div className="image-info">
              <h2 className="image-title">{image.title}</h2>
              <p className="image-description">{image.description}</p>
              {isAdmin && (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={image.isPublic}
                      onChange={() => handleCheckboxChange(image)}
                    />{" "}
                    Viewable
                  </label>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteClick(image)}
                  />
                  <div className="update-status">
                    {updateStatus[image.photoId]}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {deleteImageId && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this image?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={() => setDeleteImageId(null)}>No</button>
        </div>
      )}
      {deleteNotification && (
        <div className="delete-notification">{deleteNotification}</div>
      )}
    </div>
  );
};

export default ImageGallery;
