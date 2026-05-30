const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const {
  Teacher,
  Admission,
  Event,
  Contact,
  Gallery,
  Notice,
} = require("../models/index");
const { protect } = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const [students, teachers, admissions, events, contacts, gallery, notices] =
      await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments({ isActive: true }),
        Admission.countDocuments(),
        Event.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        Gallery.countDocuments(),
        Notice.countDocuments({ isPublished: true }),
      ]);

    const pendingAdmissions = await Admission.countDocuments({
      status: "pending",
    });
    const approvedAdmissions = await Admission.countDocuments({
      status: "approved",
    });

    const recentAdmissions = await Admission.find()
      .sort({ createdAt: -1 })
      .limit(5);
    const recentContacts = await Contact.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // 🚨 WAXAA LA CUSBOONAASIIYAY: Waxaan soo reebnay 5-ta ogeysiis ee ugu dambeeyay si React ay u hesho Array nadiif ah!
    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        students,
        teachers,
        admissions,
        pendingAdmissions,
        approvedAdmissions,
        events,
        unreadContacts: contacts,
        gallery,
        notices,
      },
      recentAdmissions,
      recentContacts,
      recentNotices, // 🔥 Hadda React marna dambe ma crash-garayso!
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
