const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./model/product');
const axios = require('axios'); // Make sure to require axios

const app = express();
const PORT = 5000;

// ... (keep all your existing middleware and setup code the same)
mongoose.connect("mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
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


// ✅ MODIFIED Upload & Process Route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  let uploadedFilePath;
  let originalFilename;

  if (req.file) {
    uploadedFilePath = req.file.path;
    originalFilename = req.file.filename;
  } else if (req.body.imageUrl) {
    try {
      const response = await axios({
        url: req.body.imageUrl,
        responseType: 'stream'
      });
      originalFilename = Date.now() + '.jpg'; // Assign a default name
      uploadedFilePath = path.join(__dirname, 'uploads', originalFilename);
      
      const writer = fs.createWriteStream(uploadedFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

    } catch (error) {
      console.error('Error downloading image from URL:', error);
      return res.status(500).json({ error: 'Failed to download image from URL.' });
    }
  } else {
    return res.status(400).json({ error: 'No file or URL provided.' });
  }

  const finalPath = uploadedFilePath.replace(/\\/g, "/");

  exec(`python clip_model.py "${finalPath}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return res.status(500).json({
        uploaded_image: originalFilename,
        clip_predictions: [],
        similar_products: [],
        error: 'Error running the Python script.'
      });
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
    }

    try {
      const lines = stdout.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const predictions = JSON.parse(lastLine);

      if (!Array.isArray(predictions)) {
        throw new Error('Predictions are not in the expected format.');
      }

      const productTags = predictions.map(p => p.label.toLowerCase().split(' ')[0]);
      const matchedProducts = await Product.find({ tags: { $in: productTags } });
      
      res.json({
        uploaded_image: originalFilename,
        clip_predictions: predictions,
        similar_products: matchedProducts
      });
    } catch (e) {
      console.error('Error parsing script output or querying DB:', e);
      res.status(500).json({
        uploaded_image: originalFilename,
        clip_predictions: [],
        similar_products: [],
        error: 'Could not find matches, but the image was uploaded.'
      });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});