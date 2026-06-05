import React, { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, toggleTheme } from "../context/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiFileText,
  FiCalendar,
  FiImage,
  FiMail,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";

const navItems = [
  { path: "/admin", icon: FiHome, label: "Dashboard", end: true },
  { path: "/admin/students", icon: FiUsers, label: "Students" },
  { path: "/admin/teachers", icon: FiUser, label: "Teachers" },
  { path: "/admin/admissions", icon: FiFileText, label: "Admissions" },
  { path: "/admin/events", icon: FiCalendar, label: "Events" },
  { path: "/admin/gallery", icon: FiImage, label: "Gallery" },
  { path: "/admin/notices", icon: FiBell, label: "Notices" },
  { path: "/admin/contacts", icon: FiMail, label: "Messages" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin } = useSelector((s) => s.auth);
  const { isDark } = useSelector((s) => s.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">D</span>
          </div>
          <div>
            <div className="font-display font-bold text-primary-800 dark:text-white text-sm">
              Doha-Model
            </div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ path, icon: Icon, label, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <FiChevronRight size={14} className="ml-auto opacity-50" />
          </NavLink>
        ))}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Settings
          </p>
          <Link to="/" target="_blank" className="admin-sidebar-link">
            <FiExternalLink size={18} />
            <span>View Website</span>
          </Link>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="admin-sidebar-link w-full text-left"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 mb-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-white text-sm truncate">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate capitalize">
              {admin?.role || "admin"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 z-50"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <FiX size={18} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Doha-Model School Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
