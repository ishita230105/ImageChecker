import React, { useState, useMemo } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const API_BASE = "https://image-checker-api.onrender.com"; // or http://localhost:5000 in dev

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [clipPredictions, setClipPredictions] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [similarityFilter, setSimilarityFilter] = useState(50);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImageUrl("");
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile && !imageUrl) {
      setError("⚠️ Please select a file or enter an image URL.");
      return;
    }

    setError(null);
    setLoading(true);
    setUploadedImage(null);
    setClipPredictions([]);
    setSimilarProducts([]);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile); // 👈 matches backend now
    } else {
      formData.append("imageUrl", imageUrl);
    }

    try {
      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedImage(response.data.uploaded_image);
      setClipPredictions(response.data.clip_predictions || []);

      const predictionsMap = new Map(
        (response.data.clip_predictions || []).map((p) => [p.label, p.score])
      );

      const productsWithScores = (response.data.similar_products || []).map(
        (product) => {
          const primaryTag = product.tags[0];
          return {
            ...product,
            score: predictionsMap.get(primaryTag) || 0,
          };
        }
      );
      setSimilarProducts(productsWithScores);

      if (response.data.error) {
        setError(`⚠️ ${response.data.error}`);
      }
    } catch (err) {
      setError("❌ An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return similarProducts.filter(
      (product) => product.score * 100 >= similarityFilter
    );
  }, [similarProducts, similarityFilter]);

  return (
    <div className="app">
      <h1>Visual Product Matcher</h1>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <p>OR</p>
        <input
          type="text"
          placeholder="Enter Image URL"
          value={imageUrl}
          onChange={handleUrlChange}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Match Products"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {uploadedImage && (
        <div className="result-section">
          <h2>Uploaded Image:</h2>
          <img
            src={`${API_BASE}/uploads/${uploadedImage}`}
            alt="Uploaded"
            className="uploaded-image"
          />

          <h2>CLIP Predictions:</h2>
          {clipPredictions.length > 0 ? (
            <ul>
              {clipPredictions.map((pred, index) => (
                <li key={index}>
                  {pred.label} → {(pred.score * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          ) : (
            <p>No predictions found.</p>
          )}

          <h2>Matched Products:</h2>
          <div className="filter-section">
            <label htmlFor="similarity">
              Minimum Similarity: {similarityFilter}%
            </label>
            <input
              type="range"
              id="similarity"
              min="0"
              max="100"
              value={similarityFilter}
              onChange={(e) => setSimilarityFilter(Number(e.target.value))}
            />
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-list">
              {filteredProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <h3>{product.name}</h3>
                  <p>
                    Similarity:{" "}
                    <strong>{(product.score * 100).toFixed(2)}%</strong>
                  </p>
                  <p>{product.description}</p>
                  <p>₹{product.price}</p>
                  <img src={product.image} alt={product.name} width="100" />
                </div>
              ))}
            </div>
          ) : (
            <p>No matching products found with the current filter setting.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
