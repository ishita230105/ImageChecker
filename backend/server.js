const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./model/product');

const app = express();
const PORT = 5000;

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ✅ Upload & Process Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const uploadedFilePath = req.file.path.replace(/\\/g, "/");

  exec(`python clip_model.py "${uploadedFilePath}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ exec error: ${error.message}`);
      return res.status(500).json({ error: 'Error processing the image with CLIP.' });
    }
    if (stderr) {
      console.error(`⚠️ Python stderr: ${stderr}`);
    }

    try {
  const lines = stdout.trim().split("\n");
  const lastLine = lines[lines.length - 1];

  const predictions = JSON.parse(lastLine);
  const productNames = predictions.map(p => p.label.toLowerCase());

  // ✅ Partial text search (case-insensitive)
  const matchedProducts = await Product.find({
    name: { $regex: productNames.join("|"), $options: "i" }
  });

  res.json({
    uploaded_image: req.file.filename,
    predictions: predictions,
    matched_products: matchedProducts
  });

  fs.unlinkSync(uploadedFilePath); 
} catch (e) {
  console.error("❌ Error parsing Python output:", e, "Raw:", stdout);
  res.status(500).json({ error: 'Invalid response from CLIP script.' });
}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
