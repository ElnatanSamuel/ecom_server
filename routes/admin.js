const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const upload = require("../config/s3");

// Single image upload route
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: req.file.location });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post(
  "/products",
  protect,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const images = req.files.map((file, index) => ({
        url: file.location,
        isThumbnail: index === 0, // First image is thumbnail by default
      }));

      const { _id, ...productData } = req.body;

      const product = await Product.create({
        ...productData,
        images,
        price: Number(productData.price),
        inStock: productData.inStock === "true",
        featured: productData.featured === "true",
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update product
router.put(
  "/products/:id",
  protect,
  upload.array("images", 5),
  async (req, res) => {
    try {
      let productData = { ...req.body };

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          url: file.location,
          isThumbnail: false,
        }));

        // If there are existing images, combine them
        const existingImages = productData.images
          ? Array.isArray(productData.images)
            ? productData.images
            : [productData.images]
          : [];

        productData.images = [...existingImages, ...newImages];
      }

      if (productData.price) {
        productData.price = Number(productData.price);
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        productData,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update product images
router.put(
  "/products/:id/images",
  protect,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const { thumbnailIndex, existingImages } = req.body;
      let updatedImages = [];

      // Add existing images
      if (existingImages) {
        const parsedExistingImages = JSON.parse(existingImages);
        updatedImages = parsedExistingImages.map((url) => ({
          url,
          isThumbnail: false,
        }));
      }

      // Add new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          url: file.location,
          isThumbnail: false,
        }));
        updatedImages = [...updatedImages, ...newImages];
      }

      // Update thumbnail - only if we have images
      if (thumbnailIndex !== undefined && updatedImages.length > 0) {
        updatedImages = updatedImages.map((img, index) => ({
          ...img,
          isThumbnail: index === Number(thumbnailIndex),
        }));
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { images: updatedImages } },
        { new: true }
      );

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product images:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete product
router.delete("/products/:id", protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dashboard stats
router.get("/stats", protect, async (req, res) => {
  try {
    const [
      totalProducts,
      featuredProducts,
      inStockProducts,
      inventoryValue,
      categoryDistribution,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ inStock: true }),
      Product.aggregate([
        { $group: { _id: null, totalValue: { $sum: "$price" } } },
      ]),
      Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);

    const categoryStats = {};
    categoryDistribution.forEach((cat) => {
      categoryStats[cat._id] = cat.count;
    });

    // Mock data for monthly revenue (last 6 months)
    const mockMonthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        amount: Math.floor(Math.random() * 50000) + 10000,
      };
    }).reverse();

    // Mock data for recent sales (last 7 days)
    const mockRecentSales = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      amount: Math.floor(Math.random() * 10000),
    })).reverse();

    // Mock data for top selling products
    const mockTopSelling = Array.from({ length: 5 }, (_, i) => ({
      _id: `product${i + 1}`,
      name: `Product ${i + 1}`,
      unitsSold: Math.floor(Math.random() * 1000) + 100,
      revenue: Math.floor(Math.random() * 50000) + 5000,
      image: `https://example.com/image${i + 1}.jpg`,
    }));

    res.json({
      totalProducts,
      featuredProducts,
      inStockProducts,
      inventoryValue: inventoryValue[0]?.totalValue || 0,
      categoryDistribution: categoryStats,
      recentSales: mockRecentSales,
      monthlyRevenue: mockMonthlyRevenue,
      topSellingProducts: mockTopSelling,
      totalOrders: Math.floor(Math.random() * 1000) + 500,
      averageOrderValue: Math.floor(Math.random() * 500) + 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products
router.get("/products", protect, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
