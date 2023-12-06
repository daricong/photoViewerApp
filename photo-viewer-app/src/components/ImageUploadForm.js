import React, { useState, useRef } from "react";
import { uploadImage } from "../services/api";
import "./css/uploadForm.css";

const ImageUploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.elements.file.files[0];
    if (!file) {
      setFileError("Please select a file");
      return;
    }

    // Validate file type
    if (!file.type.match("image/png") && !file.type.match("image/jpeg")) {
      setFileError("Only .png and .jpg files are allowed");
      return;
    }

    setUploadStatus(null);
    setFileError(null);

    try {
      const response = await uploadImage(file, { title, description });
      console.log("Upload successful:", response);
      setUploadStatus("success");
      setTimeout(() => {
        setUploadStatus(null);
        resetForm();
        onUploadSuccess();
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("fail");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            placeholder="Enter image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            placeholder="Enter image description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input type="file" name="file" ref={fileInputRef} />
          {fileError && <div className="message error">{fileError}</div>}
        </div>
        <div className="form-group button-container">
          <button type="submit">Upload Image</button>
        </div>
        {uploadStatus === "success" && (
          <div className="message success">Upload successful!</div>
        )}
        {uploadStatus === "fail" && (
          <div className="message fail">Upload failed. Please try again.</div>
        )}
      </form>
    </div>
  );
};

export default ImageUploadForm;
