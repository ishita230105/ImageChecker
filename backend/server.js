import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Make uploads folder public
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ API is running!");
});

// ✅ Upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ error: "No file or URL provided" });
    }

    let uploadedImage = null;

    if (req.file) {
      uploadedImage = req.file.filename;
    } else if (req.body.imageUrl) {
      // Handle URL input (basic version)
      uploadedImage = req.body.imageUrl;
    }

    res.json({
      uploaded_image: uploadedImage,
      clip_predictions: [], // connect your ML model later
      similar_products: [], // connect DB later
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
