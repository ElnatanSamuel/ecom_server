const mongoose = require("mongoose");
const Product = require("../models/Product");
const connectDB = require("../config/db");
require("dotenv").config();

const products = [
  {
    _id: new mongoose.Types.ObjectId("65f1e30e5d35e82d37e6c321"),
    name: "Modern Leather Sofa",
    description: "Luxurious 3-seater leather sofa with chrome legs",
    price: 1299.99,
    category: "Living Room",
    style: "Modern",
    images: [
      "https://cb2.scene7.com/is/image/CB2/LenoxLeatherSofaSHF18_1x1",
      "https://cb2.scene7.com/is/image/CB2/LenoxLeatherSofaAVSHF18_1x1",
    ],
    featured: true,
    details: [
      "Premium Italian leather",
      "Chrome-finished legs",
      "High-density foam cushions",
      "Built-in lumbar support",
    ],
    specifications: {
      dimensions: '84"W x 38"D x 34"H',
      material: "Genuine Leather",
      color: "Brown",
      weight: "120 lbs",
    },
    inStock: true,
  },
  {
    _id: new mongoose.Types.ObjectId("65f1e30e5d35e82d37e6c322"),
    name: "Scandinavian Dining Set",
    description: "Elegant 6-seater dining set with matching chairs",
    price: 899.99,
    category: "Dining",
    style: "Scandinavian",
    images: [
      "https://cb2.scene7.com/is/image/CB2/JensenDiningTableSHS19_1x1",
      "https://cb2.scene7.com/is/image/CB2/JensenDiningTableAVSHS19_1x1",
    ],
    featured: true,
    details: [
      "Solid wood construction",
      "Comfortable upholstered chairs",
      "Extendable table design",
      "Easy assembly",
    ],
    specifications: {
      dimensions: '70"W x 35"D x 29"H',
      material: "Solid Pine Wood",
      color: "White/Natural",
      weight: "180 lbs",
    },
    inStock: true,
  },
  {
    _id: new mongoose.Types.ObjectId("65f1e30e5d35e82d37e6c323"),
    name: "Modern Office Desk",
    description: "Contemporary office desk with storage",
    price: 449.99,
    category: "Office",
    style: "Modern",
    images: [
      "https://cb2.scene7.com/is/image/CB2/TrevaSitStandDeskSHS21_1x1",
      "https://cb2.scene7.com/is/image/CB2/TrevaSitStandDeskAVSHS21_1x1",
    ],
    featured: false,
    details: [
      "Built-in cable management",
      "Drawer unit included",
      "Adjustable feet",
      "Durable finish",
    ],
    specifications: {
      dimensions: '56"W x 28"D x 30"H',
      material: "Engineered Wood",
      color: "White",
      weight: "75 lbs",
    },
    inStock: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    await Product.deleteMany({});
    console.log("Deleted existing products...");

    await Product.insertMany(products);
    console.log("Added new products...");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
