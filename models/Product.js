const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Living Room", "Bedroom", "Dining", "Office", "Outdoor"],
  },
  style: {
    type: String,
    required: true,
    enum: [
      "Modern",
      "Contemporary",
      "Traditional",
      "Scandinavian",
      "Industrial",
    ],
  },
  images: [
    {
      url: { type: String, required: true },
      isThumbnail: { type: Boolean, default: false },
    },
  ],
  details: [{ type: String }],
  specifications: {
    dimensions: String,
    material: String,
    color: String,
    weight: String,
  },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
