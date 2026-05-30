const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config(); // Khadkan ayaa soo kicinaya .env

const app = express();

// Middleware - KAN CUSUB OO CORS-KA AH OO KELIYA AYAA LA BEDDELAY
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://doha-school-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/admissions", require("./routes/admissions"));
app.use("/api/events", require("./routes/events"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/notices", require("./routes/notices"));
app.use("/api/stats", require("./routes/stats"));

// 🚨 ROUTE-KA CUSUB EE BADBAADADA (Halkan ayaan ku daray)
app.get("/api/auth/setup-admin-secure", async (req, res) => {
  try {
    const User = require("./models/User");
    let bcrypt;

    // Tani waxay ka hortagtaa haddii aad bcrypt ama bcryptjs midkood haysato inuu koodku dhihi waayo error
    try {
      bcrypt = require("bcryptjs");
    } catch (e) {
      bcrypt = require("bcrypt");
    }

    // Tirtir admin-kii hore ee khaldanaa haddii uu jiro si aan isku dhex dhalasho u dhicin
    await User.deleteMany({ email: "admin@dohaschool.com" });

    // Hash-garee password-ka si rasi ah 10 salt rounds
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const newAdmin = new User({
      name: "Doha Admin",
      email: "admin@dohaschool.com",
      password: hashedPassword, // Halkan wuxuu u galayaa isagoo hash ah oo ammaan ah
      role: "admin",
    });

    await newAdmin.save();
    res.json({
      success: true,
      message:
        "✅ Admin rasi ah oo password-kiisu hash yahay ayaa lagu shubay MongoDB Atlas!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Doha School API is running",
    timestamp: new Date(),
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// KAN AA RIKHSOO: Kaliya wuxuu hadda xogta ka rabaa faylka .env
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI lagama helin faylka .env!");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully from .env");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
