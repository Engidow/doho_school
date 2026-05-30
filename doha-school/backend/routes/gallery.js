const express = require("express");
const router = express.Router();
const { Gallery } = require("../models/index");
const { protect } = require("../middleware/auth");

// Soo dhoofso middleware-ada cusub ee Supabase
const { upload, uploadToSupabase } = require("../middleware/upload");

// @GET /api/gallery - public for everyone
router.get("/", async (req, res) => {
  try {
    const { category, limit } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    let q = Gallery.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));

    const gallery = await q;

    // 🔥 BADBAADO: Had iyo jeer u soo celi Array maran [] haddii database-ku maran yahay
    res.json({ success: true, gallery: gallery || [] });
  } catch (err) {
    console.error("❌ Error in GET /api/gallery:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/gallery/all - protected admin view
router.get("/all", protect, async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });

    // 🔥 BADBAADO: Kan admin-kana sidoo kale u sii ammaan
    res.json({ success: true, gallery: gallery || [] });
  } catch (err) {
    console.error("❌ Error in GET /api/gallery/all:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/gallery (Cusboonaysiin - Supabase)
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadToSupabase,
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "Image required" });

      // req.file.path hadda waa Supabase URL-kii rasmiga ahaa
      const data = { ...req.body, image: req.file.path };

      const item = await Gallery.create(data);
      res.status(201).json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// @PUT /api/gallery/:id (Cusboonaysiin - Supabase)
router.put(
  "/:id",
  protect,
  upload.single("image"),
  uploadToSupabase,
  async (req, res) => {
    try {
      const data = { ...req.body };

      // req.file.path hadda waa Supabase URL-kii rasmiga ahaa
      if (req.file) data.image = req.file.path;

      const item = await Gallery.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });

      if (!item)
        return res
          .status(404)
          .json({ success: false, message: "Gallery item not found" });

      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// @DELETE /api/gallery/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Gallery item not found" });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
