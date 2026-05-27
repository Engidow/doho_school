require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin"); // Hubi in wadadu sax tahay

const seed = async () => {
  try {
    // KAN WAA LA SAXAY: Kaliya process.env.MONGODB_URI ayuu ka aqrinayaa.
    // Haddii laga waayo .env, wuxuu bixinayaa error cad halkii uu ka crash-gari lahaa qaab khaldan.
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      throw new Error(
        "❌ MONGODB_URI laga ma helin faylka .env! Hubi faylkaaga .env",
      );
    }

    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");

    // Tirtir admin-kii hore ee khaldanaa
    await Admin.deleteMany({ email: "admin@dohaschool.com" });

    // Halkan PASSWORD-ka waxaan u qoraynaa si CAADI AH (Plain Text)
    // Sababtoo ah Admin.create() ayaa iskood u hash-garayn doona (12 rounds)
    await Admin.create({
      name: "Super Admin",
      email: "admin@dohaschool.com",
      password: "Admin@123", // <--- Ha u samayn bcrypt halkan!
      role: "superadmin",
      isActive: true,
    });

    console.log(
      "✅ Default admin created successfully: admin@dohaschool.com / Admin@123",
    );
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();
