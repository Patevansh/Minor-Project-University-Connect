const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Move this before route definitions
app.use(express.json());
app.use(cors());

// Ensure the `certificates` folder exists
const certificatesDir = path.join(__dirname, "certificates");
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir);
}
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging log

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const studentRoutes = require("./routes/studentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const questionRoutes = require("./routes/questionRoutes"); // ✅ Question Routes
const talentMarketplaceRoutes = require("./routes/talentMarketplace");

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes); // Maps /api/users to profileRoutes
app.use("/api/students", studentRoutes);
app.use("/api/services", serviceRoutes);
// Update route mapping
app.use("/api/certification", certificationRoutes);
app.use("/api/questions", questionRoutes);

// Add CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://minor-project-university-connect-h83y.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/api/talent-marketplace", talentMarketplaceRoutes);

// ✅ Serve Certificates Publicly
app.use("/certificates", express.static(certificatesDir));

// Update MongoDB Connection Handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB(); // 🔥 Connect to MongoDB

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
