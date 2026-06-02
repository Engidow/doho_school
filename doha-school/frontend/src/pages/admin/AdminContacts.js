import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiTrash2, FiX, FiEye, FiCheck, FiPhone } from "react-icons/fi";
import api from " ../services/api";
import toast from "react-hot-toast";

function ViewModal({ contact, onClose, onUpdate }) {
  const markRead = async () => {
    try {
      await api.put(`/contacts/${contact._id}`, { isRead: true });
      toast.success("Marked as read");
      onUpdate();
      onClose();
    } catch {
      toast.error("Failed");
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">
              Message Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">From</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {contact.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary-600 hover:underline text-sm"
                >
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>
            {contact.subject && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Subject</p>
                <p className="font-medium text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                  {contact.subject}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-1">Message</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl leading-relaxed">
                {contact.message}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={`mailto:${contact.email}?subject=Re: ${contact.subject || "Your message"}`}
                className="flex-1 btn-primary text-sm py-2.5 text-center flex items-center justify-center gap-2"
              >
                <FiMail size={15} /> Reply via Email
              </a>
              {!contact.isRead && (
                <button
                  onClick={markRead}
                  className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <FiCheck size={15} /> Mark as Read
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filter !== "") params.append("isRead", filter);
      const { data } = await api.get(`/contacts?${params}`);
      setContacts(data.contacts);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success("Deleted");
      fetchContacts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          <p className="text-gray-400 text-sm">
            {total} total • {unreadCount} unread
          </p>
        </div>
      </div>

      <div className="card p-4 flex gap-2">
        {[
          { label: "All", val: "" },
          { label: "Unread", val: "false" },
          { label: "Read", val: "true" },
        ].map(({ label, val }) => (
          <button
            key={val}
            onClick={() => {
              setFilter(val);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${filter === val ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}>
                      <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse my-1" />
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FiMail size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400">No messages found.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c._id}
                    className={
                      !c.isRead ? "bg-primary-50/30 dark:bg-primary-900/10" : ""
                    }
                  >
                    <td>
                      <div>
                        <p
                          className={`text-sm ${!c.isRead ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}
                        >
                          {c.name}
                        </p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {c.subject || (
                        <span className="text-gray-300 italic text-xs">
                          No subject
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-gray-500">
                      {c.phone ? (
                        <a
                          href={`tel:${c.phone}`}
                          className="flex items-center gap-1 text-primary-600 hover:underline"
                        >
                          <FiPhone size={12} />
                          {c.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${c.isRead ? "badge-green" : "badge-yellow"}`}
                      >
                        {c.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary-600 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ViewModal
          contact={selected}
          onClose={() => setSelected(null)}
          onUpdate={fetchContacts}
        />
      )}
    </div>
  );
}
