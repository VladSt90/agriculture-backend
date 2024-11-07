// src/pages/ImageSetsPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/apiService";
import "./ImageSetsPage.css";

interface ImageSet {
  id: string;
  title: string;
  createdAt: string;
  status: string;
}

const ImageSetsPage: React.FC = () => {
  const [imageSets, setImageSets] = useState<ImageSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch image sets when component mounts
  useEffect(() => {
    const fetchImageSets = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getImageSets();
        setImageSets(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load image sets. Please try again later.");
        setLoading(false);
      }
    };
    fetchImageSets();
  }, []);

  // Handle clicking on an individual image set
  const handleViewImageSet = (id: string) => {
    navigate(`/imagesets/${id}`);
  };

  return (
    <div className="imagesets-page">
      <h2>Image Sets</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="imageset-list">
          {imageSets.length === 0 ? (
            <p>No image sets available.</p>
          ) : (
            imageSets.map((imageSet) => (
              <div
                key={imageSet.id}
                className="imageset-item"
                onClick={() => handleViewImageSet(imageSet.id)}
              >
                <h3>{imageSet.title}</h3>
                <p>
                  Created at: {new Date(imageSet.createdAt).toLocaleString()}
                </p>
                <p>Status: {imageSet.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSetsPage;
