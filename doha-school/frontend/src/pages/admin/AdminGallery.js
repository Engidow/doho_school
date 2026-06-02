import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiUpload,
  FiImage,
  FiEdit2,
} from "react-icons/fi";
import api from "../services/api";
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
  "events",
  "classroom",
  "sports",
  "graduation",
  "campus",
  "other",
];
const emptyForm = {
  title: "",
  description: "",
  category: "events",
  isPublished: true,
};

function Modal({ title, onClose, children }) {
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

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const fileRef = useRef();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/gallery/all");
      setGallery(data.gallery);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || "",
      category: item.category,
      isPublished: item.isPublished,
    });
    setImagePreview(item.image ? getImageUrl(item.image) : null);
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
    if (!editing && !imageFile) {
      toast.error("Please select an image");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const headers = { "Content-Type": "multipart/form-data" };
      if (editing) {
        await api.put(`/gallery/${editing._id}`, fd, { headers });
        toast.success("Updated!");
      } else {
        await api.post("/gallery", fd, { headers });
        toast.success("Photo uploaded!");
      }
      setShowModal(false);
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Deleted");
      fetchGallery();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered =
    filter === "all" ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Gallery
          </h2>
          <p className="text-gray-400 text-sm">{gallery.length} total photos</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <FiPlus size={16} />
          Upload Photo
        </button>
      </div>

      {/* Filter */}
      <div className="card p-4 flex flex-wrap gap-2">
        {["all", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-colors ${filter === c ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FiImage size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">
            No photos yet. Upload your first photo!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700"
            >
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiImage size={32} className="text-gray-400" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs font-medium text-center px-2 line-clamp-2">
                  {item.title}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {!item.isPublished && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Draft
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title={editing ? "Edit Photo" : "Upload Photo"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center gap-2">
                  <FiUpload size={28} className="text-gray-400" />
                  <p className="text-sm text-gray-400">Click to select image</p>
                  <p className="text-xs text-gray-300">
                    JPG, PNG, WEBP up to 5MB
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
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field text-sm py-2.5"
                placeholder="Photo title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="input-field text-sm py-2.5 resize-none"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field text-sm py-2.5"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pubg"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
                className="w-4 h-4 accent-primary-600"
              />
              <label
                htmlFor="pubg"
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
                {saving ? "Uploading..." : editing ? "Update" : "Upload Photo"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
