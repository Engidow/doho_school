import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiUser,
  FiFileText,
  FiCalendar,
  FiMail,
  FiImage,
  FiBell,
  FiArrowRight,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import api from "../../../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const statCards = [
  {
    key: "students",
    label: "Total Students",
    icon: FiUsers,
    color: "bg-blue-500",
    link: "/admin/students",
  },
  {
    key: "teachers",
    label: "Active Teachers",
    icon: FiUser,
    color: "bg-green-500",
    link: "/admin/teachers",
  },
  {
    key: "pendingAdmissions",
    label: "Pending Admissions",
    icon: FiFileText,
    color: "bg-yellow-500",
    link: "/admin/admissions",
  },
  {
    key: "unreadContacts",
    label: "Unread Messages",
    icon: FiMail,
    color: "bg-red-500",
    link: "/admin/contacts",
  },
  {
    key: "events",
    label: "Events",
    icon: FiCalendar,
    color: "bg-purple-500",
    link: "/admin/events",
  },
  {
    key: "gallery",
    label: "Gallery Items",
    icon: FiImage,
    color: "bg-teal-500",
    link: "/admin/gallery",
  },
  {
    key: "notices",
    label: "Active Notices",
    icon: FiBell,
    color: "bg-orange-500",
    link: "/admin/notices",
  },
  {
    key: "approvedAdmissions",
    label: "Approved Admissions",
    icon: FiTrendingUp,
    color: "bg-primary-600",
    link: "/admin/admissions",
  },
];

const statusBadge = (s) => {
  const map = {
    pending: "badge-yellow",
    approved: "badge-green",
    rejected: "badge-red",
    waitlisted: "badge-blue",
  };
  return (
    <span className={`badge ${map[s] || "badge-blue"} capitalize`}>{s}</span>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { admin } = useSelector((s) => s.auth);

  useEffect(() => {
    api
      .get("/stats")
      .then(({ data }) => {
        setData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    {
      label: "Add Student",
      to: "/admin/students",
      icon: FiUsers,
      color: "text-blue-600",
    },
    {
      label: "Add Teacher",
      to: "/admin/teachers",
      icon: FiUser,
      color: "text-green-600",
    },
    {
      label: "Post Event",
      to: "/admin/events",
      icon: FiCalendar,
      color: "text-purple-600",
    },
    {
      label: "Upload Photo",
      to: "/admin/gallery",
      icon: FiImage,
      color: "text-teal-600",
    },
    {
      label: "Add Notice",
      to: "/admin/notices",
      icon: FiBell,
      color: "text-orange-600",
    },
    {
      label: "View Messages",
      to: "/admin/contacts",
      icon: FiMail,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white"
      >
        <h2 className="text-2xl font-display font-bold mb-1">
          Welcome back, {admin?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-primary-200 text-sm">
          Here's what's happening at Doha-Model School today.
        </p>
        <div className="flex items-center gap-2 mt-3 text-primary-200 text-xs">
          <FiClock size={12} />{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, link }, i) => (
          <motion.div
            key={key}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            animate="visible"
          >
            <Link
              to={link}
              className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200 group "
              block
            >
              <div
                className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <div className="w-8 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  ) : (
                    (data?.stats?.[key] ?? "—")
                  )}
                </div>
                <div className="text-xs text-gray-400 leading-tight">
                  {label}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="visible"
          className="card p-6"
        >
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-5">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group text-center"
              >
                <Icon
                  size={20}
                  className={`${color} group-hover:scale-110 transition-transform`}
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Admissions */}
        <motion.div
          variants={fadeUp}
          custom={9}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">
              Recent Admissions
            </h3>
            <Link
              to="/admin/admissions"
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : data?.recentAdmissions?.length ? (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Grade</th>
                    <th>Parent</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAdmissions.map((a) => (
                    <tr key={a._id}>
                      <td className="font-medium text-gray-900 dark:text-white">
                        {a.studentName}
                      </td>
                      <td>{a.gradeApplying}</td>
                      <td>{a.parentName}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td className="text-gray-400 text-xs">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">
              No recent admissions.
            </p>
          )}
        </motion.div>
      </div>

      {/* Recent Messages */}
      {data?.recentContacts?.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={10}
          initial="hidden"
          animate="visible"
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">
              Unread Messages
            </h3>
            <Link
              to="/admin/contacts"
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentContacts.map((c) => (
              <div
                key={c._id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {c.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {c.subject && (
                  <p className="text-xs text-primary-600 mb-1">{c.subject}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {c.message}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
