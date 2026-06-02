import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCalendar,
  FiUpload,
} from "react-icons/fi";
import api from "../../../services/api";
import toast from "react-hot-toast";
const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://doha-school-backend.onrender.com/api";
  return `${BASE_URL.replace(/\/api$/, "")}${photo}`;
};

const CATEGORIES = [
  "academic",
  "sports",
  "cultural",
  "holiday",
  "exam",
  "other",
];
const CAT_COLORS = {
  academic: "badge-blue",
  sports: "badge-green",
  cultural: "badge-yellow",
  holiday: "badge-red",
  exam: "badge-blue",
  other: "badge-blue",
};
const emptyForm = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  location: "",
  category: "academic",
  isPublished: true,
};

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg my-4"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/events/all");
      setEvents(data.events);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date?.slice(0, 10),
      endDate: ev.endDate?.slice(0, 10) || "",
      location: ev.location || "",
      category: ev.category,
      isPublished: ev.isPublished,
    });
    setImagePreview(ev.image ? getImageUrl(ev.image) : null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const headers = { "Content-Type": "multipart/form-data" };
      if (editing) {
        await api.put(`/events/${editing._id}`, fd, { headers });
        toast.success("Event updated!");
      } else {
        await api.post("/events", fd, { headers });
        toast.success("Event added!");
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Deleted");
      fetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Events
          </h2>
          <p className="text-gray-400 text-sm">{events.length} total events</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <FiPlus size={16} />
          Add Event
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}>
                      <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse my-1" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No events yet. Add your first event!
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {ev.image ? (
                          <img
                            src={getImageUrl(ev.image)}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiCalendar
                              size={16}
                              className="text-primary-500"
                            />
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {ev.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${CAT_COLORS[ev.category]} capitalize`}
                      >
                        {ev.category}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-sm text-gray-500">
                      {ev.location || "—"}
                    </td>
                    <td>
                      <span
                        className={`badge ${ev.isPublished ? "badge-green" : "badge-red"}`}
                      >
                        {ev.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(ev)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(ev._id)}
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
      </div>

      {showModal && (
        <Modal
          title={editing ? "Edit Event" : "Add Event"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            {/* Image upload */}
            <div>
              <div
                className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="h-32 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <div className="py-4">
                    <FiUpload
                      size={24}
                      className="mx-auto text-gray-400 mb-2"
                    />
                    <p className="text-sm text-gray-400">
                      Click to upload event image
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileRef}
                onChange={handleImage}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field text-sm py-2.5"
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="input-field text-sm py-2.5 resize-none"
                placeholder="Event description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                  placeholder="e.g. Main Hall"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pub"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
                className="w-4 h-4 accent-primary-600"
              />
              <label
                htmlFor="pub"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Publish immediately
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 btn-secondary text-sm py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Update Event" : "Add Event"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
