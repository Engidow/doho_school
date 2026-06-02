// TeachersPage.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiBook, FiAward, FiMail } from "react-icons/fi";
import api from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

// ✅ FIX - SAXIDDA MAREEYAHA URL-KA SAWIRADA MACALLIMIINTA
const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo; // Supabase URL - toos u celi
  }
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://doha-school-backend.onrender.com/api";
  const baseWithoutApi = BASE_URL.replace(/\/api$/, "");
  return `${baseWithoutApi}${photo}`; // Local path
};

function TeacherCard({ teacher, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card p-6 text-center group hover:-translate-y-2 transition-all duration-300"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
        {teacher?.photo ? (
          <img
            src={getImageUrl(teacher.photo)}
            alt={teacher?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <FiUser size={32} className="text-primary-500" />
        )}
      </div>

      <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">
        {teacher?.name}
      </h3>

      <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
        {teacher?.subject}
      </p>

      {teacher?.qualification && (
        <p className="text-gray-400 text-xs mb-3 flex items-center justify-center gap-1">
          <FiAward size={12} />
          {teacher.qualification}
        </p>
      )}

      {teacher?.experience && (
        <p className="text-gray-400 text-xs mb-4 flex items-center justify-center gap-1">
          <FiBook size={12} />
          {teacher.experience} experience
        </p>
      )}

      {teacher?.bio && (
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {teacher.bio}
        </p>
      )}

      {teacher?.email && (
        <a
          href={`mailto:${teacher.email}`}
          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 transition-colors"
        >
          <FiMail size={12} />
          {teacher.email}
        </a>
      )}
    </motion.div>
  );
}

const demoTeachers = [
  {
    _id: "demo1",
    name: "Hodan Ali",
    subject: "Mathematics",
    qualification: "BSc Mathematics",
    experience: "8 years",
  },
  {
    _id: "demo2",
    name: "Ahmed Hassan",
    subject: "Science",
    qualification: "BSc Science",
    experience: "6 years",
  },
  {
    _id: "demo3",
    name: "Faadumo Omar",
    subject: "English Language",
    qualification: "BA English",
    experience: "10 years",
  },
  {
    _id: "demo4",
    name: "Abdi Rahman",
    subject: "Islamic Studies",
    qualification: "MA Islamic Studies",
    experience: "12 years",
  },
  {
    _id: "demo5",
    name: "Safia Yusuf",
    subject: "Computer Science",
    qualification: "BSc Computer Science",
    experience: "5 years",
  },
  {
    _id: "demo6",
    name: "Mohamed Nur",
    subject: "Somali Language",
    qualification: "BA Somali Literature",
    experience: "9 years",
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/teachers")
      .then(({ data }) => {
        const realTeachers = data?.teachers || data;
        if (realTeachers && realTeachers.length > 0) {
          setTeachers(realTeachers);
        } else {
          setTeachers(demoTeachers);
        }
      })
      .catch((err) => {
        console.error("Xogtii macallimiinta waa la waayay:", err);
        setTeachers(demoTeachers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">
            Our Educators
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">
            Meet Our Teachers
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            85+ qualified, passionate educators committed to unlocking every
            student's potential.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={`skeleton-${i}`} className="card p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((t, i) => (
                <TeacherCard
                  key={t?._id || `teacher-${i}`}
                  teacher={t}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
