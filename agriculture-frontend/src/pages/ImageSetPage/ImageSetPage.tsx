// src/pages/ImageSetPage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService, { ImageSet } from "../../services/apiService";
import "./ImageSetPage.css";

const ImageSetPage: React.FC = () => {
  const { imagesetId } = useParams<{ imagesetId: string }>();

  const [imageSet, setImageSet] = useState<ImageSet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageSet = async () => {
      try {
        setLoading(true);
        if (imagesetId) {
          const response = await apiService.getImageSetById(imagesetId);
          setImageSet(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load image set. Please try again later.");
        setLoading(false);
      }
    };
    fetchImageSet();
  }, [imagesetId, apiService]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="imageset-page">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && imageSet && (
        <div>
          <h2>{imageSet.title}</h2>
          <p>Created at: {new Date(imageSet.createdAt).toLocaleString()}</p>
          <p>Status: {imageSet.status}</p>
          <div className="image-gallery">
            {imageSet.images.length === 0 ? (
              <p>No images available for this image set.</p>
            ) : (
              imageSet.images.map((image, index) => (
                <div
                  key={index}
                  className="image-container"
                  onClick={() =>
                    handleImageClick(`http://localhost/images/${image.url}`)
                  }
                >
                  <img
                    src={`http://localhost/images/${image.url}`}
                    alt={`Image ${index + 1}`}
                  />
                  <p>Number of flowers: {image.ml_result.length}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSetPage;
