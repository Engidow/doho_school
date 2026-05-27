const multer = require("multer");
const supabase = require("../config/supabase"); // Hubi inuu sax yahay path-ka faylka sare

// Waxaan isticmaalaynaa MemoryStorage si uu sawirka kombuyuutarka u dhaafin, toosna Memory-ga u geyno
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware qaas ah oo sawirka u wareejinaya Supabase
const uploadToSupabase = async (req, res, next) => {
  if (!req.file) return next(); // Haddii aan sawir la soo dooran, iska gudbi

  try {
    // Samee magac u gaar ah sawirka si aanay u isku dhex khaldomin (e.g., 1716654-sawir.jpg)
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // U raddo sawirka Supabase Storage
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Sawirka waa la raddi waayey!" });
    }

    // Soo saar Link-ga rasmiga ah ee sawirka (Public URL)
    const { data: publicUrlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);

    // Ku keydi Link-ga cusub ee 'req.file.path' si Controller-kaaga uusan u garan isbeddelka
    req.file.path = publicUrlData.publicUrl;

    next();
  } catch (err) {
    console.error("Upload Middleware error:", err);
    res.status(500).json({ success: false, message: "Server upload error" });
  }
};

module.exports = { upload, uploadToSupabase };
