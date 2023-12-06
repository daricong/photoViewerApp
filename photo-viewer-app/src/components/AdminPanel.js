import React, { useState } from "react";
import ImageUploadForm from "./ImageUploadForm";
import ImageGallery from "./ImageGallery";
import "./css/panel.css";

const AdminPanel = () => {
  const [galleryRefresh, setGalleryRefresh] = useState(0);

  const handleUploadSuccess = () => {
    // Increment the state variable to trigger a refresh
    setGalleryRefresh((prevRefresh) => prevRefresh + 1);
  };

  return (
    <div className="panel-container">
      <h2 className="panel-title">Admin Panel</h2>
      <ImageUploadForm onUploadSuccess={handleUploadSuccess} />
      <ImageGallery key={galleryRefresh} />
    </div>
  );
};

export default AdminPanel;
