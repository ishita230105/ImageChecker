import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [clipPredictions, setClipPredictions] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("⚠️ Please select a file to upload.");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedImage(response.data.uploaded_image);
      setClipPredictions(response.data.clip_predictions || []);
      setSimilarProducts(response.data.similar_products || []);
    } catch (err) {
      console.error(err);
      setError("❌ Error processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Visual Product Matcher</h1>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload & Match Products"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {uploadedImage && (
        <div className="result-section">
          <h2>Uploaded Image:</h2>
          <img
            src={`http://localhost:5000/uploads/${uploadedImage}`}
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

          <h2>Matched Products (from MongoDB):</h2>
          {similarProducts.length > 0 ? (
            <div className="product-list">
              {similarProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>₹{product.price}</p>
                  <img src={product.image} alt={product.name} width="100" />
                </div>
              ))}
            </div>
          ) : (
            <p>No matching products in database.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
