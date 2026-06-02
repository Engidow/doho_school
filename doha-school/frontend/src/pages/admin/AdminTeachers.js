import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUser,
  FiUpload,
  FiSearch,
  FiMail,
  FiPhone,
  FiAward,
  FiBook,
  FiStar,
  // FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../services/api";
import toast from "react-hot-toast";

// ✅ BUG FIXED - Sawirka URL-ka production-ka si sax ah u sameeya
const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo; // Supabase/CDN URL - si toos ah u celi
  }
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://doha-school-backend.onrender.com/api";
  const baseWithoutApi = BASE_URL.replace(/\/api$/, "");
  return `${baseWithoutApi}${photo}`;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg my-4"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
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

function TeacherAvatar({ photo, name, size = "md" }) {
  const [imgError, setImgError] = useState(false);
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };
  const iconSizeMap = { sm: 16, md: 24, lg: 32 };
  const imageUrl = getImageUrl(photo);

  return (
    <div
      className={`${sizeMap[size]} rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden flex-shrink-0`}
    >
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <FiUser size={iconSizeMap[size]} className="text-primary-500" />
      )}
    </div>
  );
}

const emptyForm = {
  name: "",
  subject: "",
  qualification: "",
  experience: "",
  email: "",
  phone: "",
  bio: "",
  featured: false,
};

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  const fetchTeachers = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`/teachers/all?search=${q}`);
      setTeachers(data.teachers);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name,
      subject: t.subject,
      qualification: t.qualification || "",
      experience: t.experience || "",
      email: t.email || "",
      phone: t.phone || "",
      bio: t.bio || "",
      featured: t.featured || false,
    });
    // ✅ BUG FIXED - localhost:5000 la beddelay getImageUrl
    setPhotoPreview(t.photo ? getImageUrl(t.photo) : null);
    setPhotoFile(null);
    setShowModal(true);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append("photo", photoFile);
      const headers = { "Content-Type": "multipart/form-data" };

      if (editing) {
        await api.put(`/teachers/${editing._id}`, fd, { headers });
        toast.success("Teacher updated successfully!");
      } else {
        await api.post("/teachers", fd, { headers });
        toast.success("Teacher added successfully!");
      }
      setShowModal(false);
      fetchTeachers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      toast.success("Teacher deleted");
      setDeleteConfirm(null);
      fetchTeachers(search);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchTeachers(search);
  };

  const featuredCount = teachers.filter((t) => t.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Teachers
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {total} total · {featuredCount} featured
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary text-sm flex items-center gap-2 px-4 py-2.5"
        >
          <FiPlus size={16} />
          Add Teacher
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Teachers",
            value: total,
            color:
              "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
          },
          {
            label: "Featured",
            value: featuredCount,
            color:
              "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
          },
          {
            label: "Subjects",
            value: [...new Set(teachers.map((t) => t.subject))].length,
            color:
              "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
          },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p
              className={`text-2xl font-bold ${s.color.split(" ").slice(2).join(" ")}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & View Toggle */}
      <div className="card p-4 flex gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-3.5 text-gray-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
              placeholder="Search by name or subject..."
            />
          </div>
          <button type="submit" className="btn-primary text-sm px-4 py-2">
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              fetchTeachers("");
            }}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Reset"
          >
            <FiRefreshCw size={16} />
          </button>
        </form>
        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          {["grid", "list"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === mode
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {mode === "grid" ? "⊞ Grid" : "≡ List"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-1/2" />
              </div>
            ))
          ) : teachers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <FiUser size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No teachers found</p>
              <p className="text-gray-300 text-sm mt-1">
                Try a different search or add a new teacher
              </p>
            </div>
          ) : (
            teachers.map((t, i) => (
              <motion.div
                key={t._id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                className="card p-6 text-center group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative"
              >
                {t.featured && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                    <FiStar size={10} /> Featured
                  </span>
                )}

                {/* ✅ BUG FIXED - TeacherAvatar component waxay isticmaashaa getImageUrl */}
                <div className="mx-auto mb-4 w-fit">
                  <TeacherAvatar photo={t.photo} name={t.name} size="md" />
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                  {t.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-1">
                  {t.subject}
                </p>
                {t.qualification && (
                  <p className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
                    <FiAward size={10} /> {t.qualification}
                  </p>
                )}
                {t.experience && (
                  <p className="text-gray-400 text-xs mb-3 flex items-center justify-center gap-1">
                    <FiBook size={10} /> {t.experience}
                  </p>
                )}

                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Teacher
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Subject
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Qualification
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Contact
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-3">
                        <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No teachers found.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t, i) => (
                    <motion.tr
                      key={t._id}
                      variants={fadeUp}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* ✅ BUG FIXED */}
                          <TeacherAvatar
                            photo={t.photo}
                            name={t.name}
                            size="sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {t.name}
                            </p>
                            {t.experience && (
                              <p className="text-xs text-gray-400">
                                {t.experience}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                          {t.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {t.qualification || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          {t.email && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <FiMail size={10} /> {t.email}
                            </p>
                          )}
                          {t.phone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <FiPhone size={10} /> {t.phone}
                            </p>
                          )}
                          {!t.email && !t.phone && (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {t.featured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                            <FiStar size={10} /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(t)}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(t)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          title={editing ? "Edit Teacher" : "Add New Teacher"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={24} className="text-gray-300" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileRef}
                  onChange={handlePhoto}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 transition-colors"
                >
                  <FiUpload size={14} /> Upload Photo
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 5MB</p>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoFile(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-500 mt-1 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field text-sm py-2.5"
                  placeholder="Teacher's full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Subject *
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Qualification
                </label>
                <input
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                  placeholder="e.g. BSc Mathematics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Experience
                </label>
                <input
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  className="input-field text-sm py-2.5"
                  placeholder="e.g. 5 years"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field text-sm py-2.5"
                  placeholder="+252..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field text-sm py-2.5"
                  placeholder="teacher@school.com"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="input-field text-sm py-2.5 resize-none"
                  placeholder="Short bio about the teacher..."
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`relative w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-600"}`}
                    onClick={() =>
                      setForm({ ...form, featured: !form.featured })
                    }
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Feature on Homepage
                    </p>
                    <p className="text-xs text-gray-400">
                      Show this teacher in the public teachers section
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
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
                className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : editing ? (
                  "Update Teacher"
                ) : (
                  "Add Teacher"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal title="Delete Teacher" onClose={() => setDeleteConfirm(null)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={24} className="text-red-500" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
              Are you sure?
            </h4>
            <p className="text-gray-500 text-sm mb-1">
              You are about to delete{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {deleteConfirm.name}
              </span>
              .
            </p>
            <p className="text-gray-400 text-xs mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary text-sm py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
