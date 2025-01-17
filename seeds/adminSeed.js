const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");
require("dotenv").config();

const admin = {
  email: "admin@shop.com",
  password: "admin1234",
  name: "Admin User",
  role: "super-admin",
};

const seedAdmin = async () => {
  try {
    await connectDB();
    await Admin.deleteMany({});
    await Admin.create(admin);
    console.log("Admin seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
