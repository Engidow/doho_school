// EventsPage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiTag, FiImage } from "react-icons/fi";
import api from "../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const catColors = {
  academic: "badge-blue",
  sports: "badge-green",
  cultural: "badge-yellow",
  holiday: "badge-red",
  exam: "badge-blue",
  other: "badge-blue",
};

// ✅ HELITAANKA URL-KA SAWIRKA (Supabase ama Local Backend)
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image; // Supabase URL - toos u celi
  }
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://doha-school-backend.onrender.com/api";
  const baseWithoutApi = BASE_URL.replace(/\/api$/, "");
  return `${baseWithoutApi}${image}`;
};

const demoEvents = [
  {
    _id: "1",
    title: "Annual Sports Day 2024",
    description:
      "A full day of athletic competition including track events, football, and team sports.",
    date: "2024-03-15",
    category: "sports",
    location: "School Grounds",
  },
  {
    _id: "2",
    title: "National Exam Preparation Workshop",
    description:
      "Intensive preparation workshop for Grade 12 national examinations.",
    date: "2024-02-20",
    category: "exam",
    location: "Main Hall",
  },
  {
    _id: "3",
    title: "Cultural Heritage Week",
    description:
      "Celebrating Somali culture through music, art, drama, and traditional cuisine.",
    date: "2024-04-01",
    category: "cultural",
    location: "School Campus",
  },
  {
    _id: "4",
    title: "Parent-Teacher Conference",
    description:
      "End of semester meetings between parents and teachers to discuss student progress.",
    date: "2024-01-25",
    category: "academic",
    location: "Classrooms",
  },
  {
    _id: "5",
    title: "Science Fair 2024",
    description:
      "Students showcase innovative science projects and research across all grade levels.",
    date: "2024-05-10",
    category: "academic",
    location: "Science Lab",
  },
  {
    _id: "6",
    title: "Eid Holiday Break",
    description:
      "School will be closed for Eid Al-Fitr celebrations. Classes resume after the holiday.",
    date: "2024-04-10",
    category: "holiday",
    location: "N/A",
  },
];

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .get("/events")
      .then(({ data }) =>
        setEvents(data.events?.length ? data.events : demoEvents),
      )
      .catch(() => setEvents(demoEvents));
  }, []);

  const filtered =
    filter === "all" ? events : events.filter((e) => e.category === filter);
  const cats = [
    "all",
    "academic",
    "sports",
    "cultural",
    "holiday",
    "exam",
    "other",
  ];

  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">
            School Calendar
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">
            Events & News
          </h1>
          <p className="text-primary-100 text-lg">
            Stay updated with all school activities, events, and important
            announcements.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev, i) => (
              <motion.div
                key={ev._id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* ✅ QAYBTA SAWIRKA DHACDADA */}
                  <div className="w-full h-48 overflow-hidden rounded-xl mb-4 bg-gray-100 dark:bg-gray-800 relative group">
                    {ev.image ? (
                      <img
                        src={getImageUrl(ev.image)}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage size={32} className="opacity-40" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`badge ${catColors[ev.category] || "badge-blue"} capitalize`}
                    >
                      <FiTag size={10} className="mr-1" />
                      {ev.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FiCalendar size={12} />
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {ev.description}
                  </p>
                </div>

                {ev.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto border-t border-gray-100 dark:border-gray-800 pt-3">
                    <FiMapPin size={12} />
                    {ev.location}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default EventsPage;
