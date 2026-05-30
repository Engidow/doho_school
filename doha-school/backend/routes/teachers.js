const express = require("express");
const router = express.Router();
const { Teacher } = require("../models/index");
const { protect } = require("../middleware/auth");

// Soo dhoofso middleware-ada cusub ee Supabase
const { upload, uploadToSupabase } = require("../middleware/upload");

// @GET /api/teachers - public view for everyone
router.get("/", async (req, res) => {
  try {
    // Badbaado: Hubi in Model-ku uu jiro kahor intaan la garaacin database-ka
    if (!Teacher) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Teacher model is not defined in models/index.js",
        });
    }

    const { featured, limit } = req.query;
    const query = {}; // Waan ka saarnay 'isActive: true' si koodku u san u crash-garoobin haddii field-kaas uusan hadda u dhisneyn ardayda/macallimiinta cusub

    if (featured === "true") query.featured = true;

    let q = Teacher.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));

    const teachers = await q;

    // Had iyo jeer u soo celi Array, xataa haddii uu maran yahay []
    res.json({ success: true, teachers: teachers || [] });
  } catch (err) {
    console.error("❌ Error in GET /api/teachers:", err.message); // Tani waxay logs-ka Render ku tusaysaa dhibka dhabta ah
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/teachers/all - protected admin view
router.get("/all", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      teachers: teachers || [],
      total,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1, // Badbaado haddii total uu yahay 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/teachers (Cusboonaysiin - Supabase)
router.post(
  "/",
  protect,
  upload.single("photo"),
  uploadToSupabase,
  async (req, res) => {
    try {
      const data = { ...req.body };

      // req.file.path hadda waa Supabase URL-kii rasmiga ahaa
      if (req.file) data.photo = req.file.path;

      const teacher = await Teacher.create(data);
      res.status(201).json({ success: true, teacher });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// @PUT /api/teachers/:id (Cusboonaysiin - Supabase)
router.put(
  "/:id",
  protect,
  upload.single("photo"),
  uploadToSupabase,
  async (req, res) => {
    try {
      const data = { ...req.body };

      if (req.file) data.photo = req.file.path;

      const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      if (!teacher)
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found" });
      res.json({ success: true, teacher });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// @DELETE /api/teachers/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
