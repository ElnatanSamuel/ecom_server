import mongoose from "mongoose";
import Product from "../models/Product.js";

const products = [
  {
    name: "Modern Leather Sofa",
    description: "Elegant and comfortable modern leather sofa",
    price: 1299.99,
    category: "Living Room",
    style: "Modern",
    images: [
      "https://www.orangetree.in/cdn/shop/files/Gallery-1ChiyoL-ShapedSofaBuyOnline.jpg?v=1722852692",
    ],
    details: [
      "Premium leather upholstery",
      "Sturdy wooden frame",
      "High-density foam cushions",
      "Modern design elements",
    ],
    specifications: {
      dimensions: '84" W x 35" D x 31" H',
      material: "Genuine leather, solid wood",
      color: "Brown",
      weight: "120 lbs",
    },
    featured: true,
  },
  // Add about 20 more products following the same structure,
  // covering all categories and styles
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
