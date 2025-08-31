import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import Product from "./model/product.js"; // make sure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ Multer setup
const upload = multer({ dest: "uploads/" });

// ✅ Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is running!");
});

// ✅ Upload endpoint
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ error: "No image uploaded or URL provided" });
    }

    // Mock CLIP predictions (replace with Python service later if required)
    const clip_predictions = [
      { label: "shoe", score: 0.92 },
      { label: "sneaker", score: 0.87 },
      { label: "bag", score: 0.75 },
      { label: "watch", score: 0.68 },
      { label: "jacket", score: 0.55 }
    ];

    // Get product matches from DB based on tags
    const tags = clip_predictions.map((p) => p.label);
    const similar_products = await Product.find({ tags: { $in: tags } }).limit(5);

    res.json({
      uploaded_image: req.file ? req.file.filename : req.body.imageUrl,
      clip_predictions,
      similar_products
    });
  } catch (error) {
    console.error(" Upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
