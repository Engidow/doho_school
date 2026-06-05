import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // Ka bixi haddii aad meel kale u raddaysay

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Academics", path: "/academics" },
    { title: "Admissions", path: "/admissions" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <div
      className={`min-h-screen font-sans ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}
    >
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-xs py-2 px-4 sm:px-6 lg:px-8 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1">
              <Phone size={14} /> +252 61 4555518
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} /> dohaschool@gmail.com
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> Mogadishu, Somalia
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Facebook size={14} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Twitter size={14} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold text-blue-600 dark:text-blue-400"
              >
                <GraduationCap className="w-8 h-8" />
                <span>Doha-Model School</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    location.pathname === link.path
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  }`}
                >
                  {link.title}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600"
                    />
                  )}
                </Link>
              ))}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-slate-600" />
                )}
              </button>

              <Link
                to="/portal"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
              >
                Portal
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
                <Link
                  to="/portal"
                  className="block w-full text-center bg-blue-600 text-white px-3 py-2.5 rounded-md text-base font-medium"
                >
                  Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className={`border-t ${isDarkMode ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-900 border-slate-800 text-slate-300"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="flex items-center gap-2 text-xl font-bold text-white">
                <GraduationCap className="w-6 h-6 text-blue-500" /> Doha School
              </span>
              <p className="text-sm">
                Xarun waxbarasho oo bixisa tacliin tayo sare leh, diyaarisana
                jiil aqoon iyo anshax leh.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/academics"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Academics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admissions"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Admissions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone size={14} /> +252 61 4555518
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} /> dohaschool@gmail.com
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Siri iimeylkaaga"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Ku weheliso
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-xs">
            <p>
              &copy; {new Date().getFullYear()} Doha-Model School. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
