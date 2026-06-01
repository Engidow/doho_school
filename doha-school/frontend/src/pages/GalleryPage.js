import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiImage } from "react-icons/fi";
import api from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

// ✅ FIX - localhost bedeshay environment variable
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image; // Supabase URL - toos celi
  }
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://doha-school-backend.onrender.com/api";
  // /api ka jar haddii uu ku dhammaado
  const baseWithoutApi = BASE_URL.replace(/\/api$/, "");
  return `${baseWithoutApi}${image}`;
};

// Demo gallery with colored boxes
const demoGallery = [
  {
    _id: "1",
    title: "School Graduation Ceremony",
    category: "graduation",
    color: "from-blue-400 to-blue-600",
  },
  {
    _id: "2",
    title: "Sports Day 2023",
    category: "sports",
    color: "from-green-400 to-green-600",
  },
  {
    _id: "3",
    title: "Science Laboratory",
    category: "classroom",
    color: "from-purple-400 to-purple-600",
  },
  {
    _id: "4",
    title: "Cultural Event",
    category: "events",
    color: "from-orange-400 to-orange-600",
  },
  {
    _id: "5",
    title: "School Campus",
    category: "campus",
    color: "from-teal-400 to-teal-600",
  },
  {
    _id: "6",
    title: "Classroom Learning",
    category: "classroom",
    color: "from-pink-400 to-pink-600",
  },
  {
    _id: "7",
    title: "Computer Lab",
    category: "classroom",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    _id: "8",
    title: "Annual Day Celebration",
    category: "events",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    _id: "9",
    title: "Sports Tournament",
    category: "sports",
    color: "from-red-400 to-red-600",
  },
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get("/gallery")
      .then(({ data }) =>
        setGallery(data.gallery?.length ? data.gallery : demoGallery),
      )
      .catch(() => setGallery(demoGallery));
  }, []);

  const cats = ["all", "events", "classroom", "sports", "graduation", "campus"];
  const filtered =
    filter === "all" ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">
            Visual Tour
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">
            School Gallery
          </h1>
          <p className="text-primary-100 text-lg">
            Moments and memories from Doha-Model School's vibrant community
            life.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === c ? "bg-primary-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => setSelected(item)}
                className="break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative"
              >
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className={`aspect-square bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                  >
                    <FiImage size={40} className="text-white opacity-70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
              {selected.image ? (
                <img
                  src={getImageUrl(selected.image)}
                  alt={selected.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                  className="w-full rounded-2xl object-contain max-h-[80vh]"
                />
              ) : (
                <div
                  className={`aspect-video bg-gradient-to-br ${selected.color} rounded-2xl flex items-center justify-center`}
                >
                  <FiImage size={80} className="text-white opacity-50" />
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="text-white font-display font-bold text-xl">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="text-gray-400 text-sm mt-2">
                    {selected.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
