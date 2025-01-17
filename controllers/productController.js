const Product = require("../models/Product");

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const { category, style, priceRange, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (style) query.style = style;
    if (featured) query.featured = featured === "true";

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        query.price = { $gte: min, $lte: max };
      } else {
        query.price = { $gte: min };
      }
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
