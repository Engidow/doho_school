import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Bell,
  Mail,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Eye,
} from "lucide-react";
import { logout } from "../store/authSlice";
import { useTheme } from "../context/ThemeContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth) || {
    user: { name: "Admin User" },
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { title: "Students", path: "/admin/students", icon: <Users size={20} /> },
    {
      title: "Teachers",
      path: "/admin/teachers",
      icon: <GraduationCap size={20} />,
    },
    {
      title: "Admissions",
      path: "/admin/admissions",
      icon: <FileText size={20} />,
    },
    { title: "Notices", path: "/admin/notices", icon: <Bell size={20} /> },
    { title: "Messages", path: "/admin/messages", icon: <Mail size={20} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen font-sans flex ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"}`}
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`w-64 fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r transition-colors duration-200 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            <GraduationCap className="w-7 h-7" />
            <span>Doha Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <Eye size={18} />
            <span>View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Side */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          className={`h-20 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b backdrop-blur-md ${
            isDarkMode
              ? "bg-slate-950/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open Sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className={`fixed inset-y-0 left-0 w-64 z-50 flex flex-col p-4 lg:hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-blue-600">
                  Doha Admin
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                  aria-label="Close Sidebar"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1.5 flex-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm ${location.pathname === item.path ? "bg-blue-600 text-white" : ""}`}
                  >
                    {item.icon} <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
