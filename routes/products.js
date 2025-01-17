const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Featured products route (must come before /:id)
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with filters
router.get("/", async (req, res) => {
  try {
    const { category, style, priceRange, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (style) query.style = style;
    if (featured) query.featured = featured === "true";

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      query.price = {};
      if (min) query.price.$gte = min;
      if (max) query.price.$lte = max;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID (must come last)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error finding product:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
