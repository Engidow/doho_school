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

    // 🔥 BADBAADO: Had iyo jeer u soo celi Array maran [] haddii database-ku maran yahay
    res.json({ success: true, events: events || [] });
  } catch (err) {
    console.error("❌ Error in GET /api/events:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Helitaanka Dhacdooyinka oo dhan (Admin kaliya)
router.get("/all", protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });

    // 🔥 BADBAADO: Sidoo kale u sii ammaan qaybta Admin-ka
    res.json({ success: true, events: events || [] });
  } catch (err) {
    console.error("❌ Error in GET /api/events/all:", err.message);
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

      if (req.file) data.image = req.file.path;

      const event = await Event.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });

      // 🔥 BADBAADO: Hubi haddii dhacdada la raadinayo la waayo
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      res.json({ success: true, event });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// 5. Tirtirista Dhacdo
router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    // 🔥 BADBAADO: Hubi haddii dhacdada mar hore la tirtiray
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
