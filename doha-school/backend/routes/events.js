const express = require("express");
const router = express.Router();
const { Event } = require("../models/index");
const { protect } = require("../middleware/auth");

// Waxaan soo kaxaysanaynaa labadii middleware ee Supabase
const { upload, uploadToSupabase } = require("../middleware/upload");

// 1. Helitaanka Dhacdooyinka la daabacay (Dadweynaha)
router.get("/", async (req, res) => {
  try {
    const { limit, category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    let q = Event.find(query).sort({ date: -1 });
    if (limit) q = q.limit(Number(limit));
    const events = await q;
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Helitaanka Dhacdooyinka oo dhan (Admin kaliya)
router.get("/all", protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Abuurista Dhacdo Cusub (Cusboonaysiin - Supabase)
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadToSupabase,
  async (req, res) => {
    try {
      const data = { ...req.body };

      // req.file.path hadda wuxuu si toos ah u yahay link-ga rasmiga ah ee Supabase URL
      if (req.file) data.image = req.file.path;

      const event = await Event.create(data);
      res.status(201).json({ success: true, event });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// 4. Wax ka beddelka Dhacdo Jirta (Cusboonaysiin - Supabase)
router.put(
  "/:id",
  protect,
  upload.single("image"),
  uploadToSupabase,
  async (req, res) => {
    try {
      const data = { ...req.body };

      // req.file.path hadda wuxuu si toos ah u yahay link-ga rasmiga ah ee Supabase URL
      if (req.file) data.image = req.file.path;

      const event = await Event.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.json({ success: true, event });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// 5. Tirtirista Dhacdo
router.delete("/:id", protect, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
