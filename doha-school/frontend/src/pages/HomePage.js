import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useInView as useIOInView } from "react-intersection-observer";
import {
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiBook,
  FiAward,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiChevronRight,
  FiPlay,
} from "react-icons/fi";
import {
  HiOutlineAcademicCap,
  HiOutlineGlobe,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const stats = [
  {
    label: "Students Enrolled",
    value: 1200,
    suffix: "+",
    icon: FiUsers,
    color: "text-blue-500",
  },
  {
    label: "Qualified Teachers",
    value: 85,
    suffix: "+",
    icon: FiAward,
    color: "text-green-500",
  },
  {
    label: "Years of Excellence",
    value: 15,
    suffix: "+",
    icon: FiStar,
    color: "text-yellow-500",
  },
  {
    label: "Pass Rate",
    value: 97,
    suffix: "%",
    icon: FiCheckCircle,
    color: "text-purple-500",
  },
];

const features = [
  {
    icon: HiOutlineAcademicCap,
    title: "Academic Excellence",
    desc: "Rigorous curriculum following national standards with international perspective.",
  },
  {
    icon: HiOutlineLightBulb,
    title: "Modern Learning",
    desc: "State-of-the-art facilities and technology-enhanced learning environments.",
  },
  {
    icon: HiOutlineHeart,
    title: "Character Building",
    desc: "Holistic development focusing on values, ethics, and leadership skills.",
  },
  {
    icon: HiOutlineGlobe,
    title: "Global Outlook",
    desc: "Preparing students for global citizenship and multicultural understanding.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Safe Environment",
    desc: "A safe, inclusive, and nurturing environment for every student.",
  },
  {
    icon: FiBook,
    title: "Rich Curriculum",
    desc: "Sciences, arts, languages, Islamic studies, and physical education.",
  },
];

const subjects = [
  {
    name: "Mathematics",
    grade: "All Grades",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  },
  {
    name: "Science",
    grade: "All Grades",
    color:
      "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  },
  {
    name: "English",
    grade: "All Grades",
    color:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  },
  {
    name: "Somali Language",
    grade: "All Grades",
    color:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
  },
  {
    name: "Islamic Studies",
    grade: "All Grades",
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300",
  },
  {
    name: "Social Studies",
    grade: "All Grades",
    color: "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300",
  },
  {
    name: "Computer Science",
    grade: "Gr 7–12",
    color:
      "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  },
  {
    name: "Physical Education",
    grade: "All Grades",
    color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  },
];

const testimonials = [
  {
    name: "Faadumo Ahmed",
    role: "Parent of Grade 8 Student",
    text: "Doha-Model School has transformed my daughter. The teachers are dedicated and the environment is excellent. My child loves coming to school every day.",
    rating: 5,
  },
  {
    name: "Mustafa Ibrahim",
    role: "Alumni, Now University Student",
    text: "The foundation I received at Doha-Model School prepared me well for university. The quality of education here is truly outstanding.",
    rating: 5,
  },
  {
    name: "Halimo Warsame",
    role: "Parent of Grade 4 Student",
    text: "Amazing school with caring teachers. My son has improved tremendously in both academics and character. Highly recommend to all parents.",
    rating: 5,
  },
];

function StatCard({ stat, index }) {
  const [ref, inView] = useIOInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="card p-6 text-center group hover:-translate-y-1 transition-transform duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 ${stat.color}`}
      >
        <stat.icon size={22} />
      </div>
      <div className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
        {inView ? (
          <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
        ) : (
          `0${stat.suffix}`
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [heroRef, heroInView] = useIOInView({ triggerOnce: true });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        {/* Animated circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 text-sm mb-6">
              <FiStar size={14} className="text-gold-400" /> Somalia's Premier
              School
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Shaping Future
              <br />
              <span className="text-gold-400">Leaders</span> of
              <br />
              Tomorrow
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-xl">
              Doha-Model Primary & Secondary School provides world-class
              education in the heart of Mogadishu, nurturing young minds with
              knowledge, values, and skills for a brighter future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admissions" className="btn-primary text-base group">
                Apply for Admission
                <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn-outline-white text-base">
                Learn More
              </Link>
            </div>

            {/* Quick Info */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Grades", value: "1 – 12" },
                { label: "Location", value: "Mogadishu" },
                { label: "Since", value: "2009" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass rounded-xl p-3 text-center"
                >
                  <div className="text-white font-bold text-lg">
                    {item.value}
                  </div>
                  <div className="text-primary-200 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full h-[500px]">
              {/* Main card */}
              <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
                <div className="h-full bg-gradient-to-br from-primary-400/20 to-primary-800/40 flex items-center justify-center">
                  <div className="text-center p-10">
                    <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <HiOutlineAcademicCap size={48} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      Academic Year 2026
                    </h3>
                    <p className="text-primary-100 text-sm mb-6">
                      Admissions Now Open for All Grades
                    </p>
                    <Link
                      to="/admissions"
                      className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm"
                    >
                      <FiPlay size={14} /> Apply Today
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center">
                    <FiCheckCircle size={16} className="text-green-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">97% Pass Rate</div>
                    <div className="text-xs text-primary-200">
                      National Exams 2023
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-400/20 rounded-xl flex items-center justify-center">
                    <FiUsers size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">1,200+ Students</div>
                    <div className="text-xs text-primary-200">
                      Enrolled This Year
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2">
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-6 flex items-center justify-center"
          >
            <FiChevronRight className="rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* About / Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                <div className="text-center text-white p-10">
                  <HiOutlineAcademicCap
                    size={80}
                    className="mx-auto mb-4 opacity-80"
                  />
                  <h3 className="text-2xl font-display font-bold mb-2">
                    Est. 2009
                  </h3>
                  <p className="text-primary-200">
                    15+ Years of Educational Excellence
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 card p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                    <FiAward size={22} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      Top Ranked
                    </div>
                    <div className="text-gray-400 text-xs">
                      School in Mogadishu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="section-subheading mb-4">About Our School</p>
            <h2 className="section-heading mb-6">
              Nurturing Minds, Building Character
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Doha-Model Primary & Secondary School has been a beacon of
              educational excellence in Mogadishu since 2009. Located in the
              heart of Tabeelaha Sheekh Ibraahim, we serve over 1,200 students
              from Grade 1 through Grade 12.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Our dedicated team of 85+ qualified teachers combines rigorous
              academic standards with holistic development, ensuring every
              student reaches their full potential in a safe, inclusive, and
              inspiring environment.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "Qualified Teaching Staff",
                "Modern Classrooms",
                "Science Laboratories",
                "Library & Resources",
                "Sports Facilities",
                "Computer Labs",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <FiCheckCircle
                    size={16}
                    className="text-green-500 flex-shrink-0"
                  />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="btn-primary inline-flex items-center gap-2"
            >
              Discover More <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-primary-900 dark:bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="section-subheading text-primary-300 mb-3">
              Our Purpose
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-12">
              Vision & Mission
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Our Vision",
                icon: HiOutlineGlobe,
                text: "To be the leading school in Somalia that produces globally competent, morally upright, and academically excellent graduates who contribute positively to society and the development of their nation.",
                color: "from-blue-500 to-primary-600",
              },
              {
                title: "Our Mission",
                icon: HiOutlineLightBulb,
                text: "To provide quality, inclusive, and holistic education that develops the intellectual, spiritual, social, and physical capabilities of every student, guided by Islamic values and modern pedagogical practices.",
                color: "from-gold-500 to-orange-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 text-left group hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-primary-200 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Why Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Why Choose Us</p>
            <h2 className="section-heading">What Makes Us Different</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-7 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors duration-300">
                  <f.icon
                    size={22}
                    className="text-primary-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card p-10 md:p-14 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary-50 dark:bg-primary-900/20 rounded-br-full"></div>
            <div className="relative flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-shrink-0 text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiOutlineAcademicCap size={50} className="text-white" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">
                  Mr. Abdullahi Omar
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  School Principal
                </p>
              </div>
              <div>
                <div className="text-5xl text-primary-200 dark:text-primary-700 font-display font-bold leading-none mb-4">
                  "
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-lg italic">
                  Welcome to Doha-Model Primary & Secondary School — a place
                  where every child's potential is recognized, nurtured, and
                  celebrated. We are committed to providing an education that
                  goes beyond academic achievement to encompass character,
                  creativity, and compassion.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our teachers are passionate educators who believe in the power
                  of education to transform lives. Together with parents and
                  community, we create a partnership that ensures every student
                  succeeds. I warmly invite you to join our school family.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <p className="section-subheading text-xs">
                    Message from the Principal
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academics / Subjects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Our Curriculum</p>
            <h2 className="section-heading mb-4">Subjects We Offer</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive curriculum designed to develop well-rounded students
              ready for higher education and professional life.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`p-5 rounded-2xl ${s.color} hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                <FiBook size={20} className="mb-3" />
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs opacity-70 mt-1">{s.grade}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/academics" className="btn-secondary">
              View Full Curriculum <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Admission CTA */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="section-subheading text-primary-300 mb-3">
              Join Our Family
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Admissions Open for 2024
            </h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
              Give your child the gift of quality education. Apply now and
              secure a place in one of Mogadishu's finest schools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/admissions" className="btn-primary text-base">
                Apply Now <FiArrowRight className="inline ml-2" />
              </Link>
              <a
                href="tel:+252614555518"
                className="btn-outline-white text-base"
              >
                <FiPhone className="inline mr-2" /> Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Testimonials</p>
            <h2 className="section-heading">What Parents Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-7 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar
                      key={j}
                      className="text-gold-400 fill-gold-400"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Quick */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subheading mb-3">Get in Touch</p>
            <h2 className="section-heading">Contact Information</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: FiPhone,
                label: "Phone",
                value: "+252 61 4555518",
                href: "tel:+252614555518",
                color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
              },
              {
                icon: FiMail,
                label: "Email",
                value: "doohaschool@gmail.com",
                href: "mailto:doohaschool@gmail.com",
                color: "bg-green-50 dark:bg-green-900/20 text-green-600",
              },
              {
                icon: FiMapPin,
                label: "Address",
                value: "Tabeelaha Sheekh Ibraahim, Mogadishu",
                href: null,
                color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card p-7 text-center group hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={24} />
                </div>
                <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Google Map */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card overflow-hidden rounded-2xl h-64 md:h-80"
          >
            <iframe
              title="Doha-Model School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125988.55297891!2d45.2345!3d2.0469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58430c4fda46eb%3A0x8b5823cc27db7b7!2sMogadishu%2C+Somalia!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-0 dark:grayscale"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
