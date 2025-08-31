const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  image: String, // store URL or local path
});

module.exports = mongoose.model("Product", ProductSchema);
