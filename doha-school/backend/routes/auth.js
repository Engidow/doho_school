const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/auth");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;

      // WAXAA LA SAXAY HALKAN: Email-ka waxaa loo beddelayaa xuruuf yaryar, meelaha bannaanna waa laga saaray
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      const isMatch = await admin.comparePassword(password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

      res.json({
        success: true,
        token: generateToken(admin._id),
        admin: admin.toJSON(),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// @GET /api/auth/me - get current admin
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @POST /api/auth/register - create first admin (disable after setup)
router.post("/register", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    // Allow registration only if no admin exists yet
    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: "Registration disabled. Contact superadmin.",
      });
    }
    const { name, email, password } = req.body;
    const admin = await Admin.create({
      name,
      email,
      password,
      role: "superadmin",
    });
    res
      .status(201)
      .json({ success: true, message: "Admin created", admin: admin.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/auth/change-password
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin._id);
      const isMatch = await admin.comparePassword(req.body.currentPassword);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Current password incorrect" });

      admin.password = req.body.newPassword;
      await admin.save();
      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
