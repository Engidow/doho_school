import React, { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../context/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/academics", label: "Academics" },
  { path: "/teachers", label: "Teachers" },
  { path: "/admissions", label: "Admissions" },
  { path: "/events", label: "Events" },
  { path: "/gallery", label: "Gallery" },
  { path: "/contact", label: "Contact" },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark } = useSelector((s) => s.theme);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary-800 dark:bg-primary-950 text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href="tel:+252614555518"
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <FiPhone size={11} /> +252 61 4555518
            </a>
            <a
              href="mailto:doohaschool@gmail.com"
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <FiMail size={11} /> doohaschool@gmail.com
            </a>
            <span className="flex items-center gap-1.5 text-primary-300">
              <FiMapPin size={11} /> Tabeelaha Sheekh Ibraahim, Mogadishu
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary-300">Follow us:</span>
            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-gold-400 transition-colors"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-display font-bold text-lg">
                D
              </span>
            </div>
            <div>
              <div className="font-display font-bold text-primary-800 dark:text-white text-sm lg:text-base leading-tight">
                Doha-Model
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                Primary & Secondary School
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <Link
              to="/admissions"
              className="hidden lg:block btn-primary text-sm py-2.5"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/"}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary-600 bg-primary-50 dark:bg-primary-900/30"
                          : "text-gray-600 dark:text-gray-300"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <Link to="/admissions" className="btn-primary text-center mt-2">
                  Apply Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-gold-400">
                    D
                  </span>
                </div>
                <div>
                  <div className="font-display font-bold text-white">
                    Doha-Model School
                  </div>
                  <div className="text-xs text-primary-300">
                    Excellence in Education
                  </div>
                </div>
              </div>
              <p className="text-primary-200 text-sm leading-relaxed mb-5">
                Providing quality primary and secondary education in Mogadishu,
                Somalia. Building tomorrow's leaders through knowledge,
                character, and innovation.
              </p>
              <div className="flex gap-3">
                {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                      <Icon size={15} />
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {navLinks.map(({ path, label }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-primary-200 hover:text-gold-400 text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academics */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                Academics
              </h4>
              <ul className="space-y-3">
                {[
                  "Primary Section (Gr 1-6)",
                  "Secondary Section (Gr 7-12)",
                  "Mathematics",
                  "Sciences",
                  "Languages",
                  "Islamic Studies",
                  "Computer Science",
                  "Physical Education",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-primary-200 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                Contact Us
              </h4>
              <div className="space-y-4">
                <a
                  href="tel:+252614555518"
                  className="flex items-start gap-3 text-primary-200 hover:text-gold-400 transition-colors"
                >
                  <FiPhone size={15} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">+252 61 4555518</span>
                </a>
                <a
                  href="mailto:doohaschool@gmail.com"
                  className="flex items-start gap-3 text-primary-200 hover:text-gold-400 transition-colors"
                >
                  <FiMail size={15} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">doohaschool@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-primary-200">
                  <FiMapPin size={15} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Tabeelaha Sheekh Ibraahim,
                    <br />
                    Mogadishu, Somalia
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-red-300">
                    Currently Closed
                  </span>
                </div>
                <p className="text-xs text-primary-300">
                  School hours: Mon–Fri, 7:30 AM – 2:30 PM
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-300 text-sm">
              © {new Date().getFullYear()} Doha-Model Primary & Secondary
              School. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/about"
                className="text-primary-300 hover:text-white text-xs transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/about"
                className="text-primary-300 hover:text-white text-xs transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                to="/admin"
                className="text-primary-300 hover:text-white text-xs transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
