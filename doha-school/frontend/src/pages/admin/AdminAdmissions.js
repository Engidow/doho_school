import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiTrash2, FiX, FiFilter } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "badge-yellow",
  approved: "badge-green",
  rejected: "badge-red",
  waitlisted: "badge-blue",
};

function ViewModal({ admission, onClose, onStatusChange }) {
  const [status, setStatus] = useState(admission.status);
  const [saving, setSaving] = useState(false);
  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/admissions/${admission._id}`, { status });
      toast.success("Status updated!");
      onStatusChange();
      onClose();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
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
              Admission Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Student Name", admission.studentName],
                ["Grade Applying", admission.gradeApplying],
                ["Parent Name", admission.parentName],
                ["Parent Email", admission.parentEmail],
                ["Parent Phone", admission.parentPhone],
                ["Previous School", admission.previousSchool || "—"],
                [
                  "Applied Date",
                  new Date(admission.createdAt).toLocaleDateString(),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {admission.message && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Message</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  {admission.message}
                </p>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field text-sm py-2.5"
              >
                {["pending", "approved", "rejected", "waitlisted"].map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary text-sm py-2.5"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status) params.append("status", status);
      const { data } = await api.get(`/admissions?${params}`);
      setAdmissions(data.admissions);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [page, status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/admissions/${id}`);
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
            Admissions
          </h2>
          <p className="text-gray-400 text-sm">{total} total applications</p>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <FiFilter size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {["", "pending", "approved", "rejected", "waitlisted"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${status === s ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Parent</th>
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
                    <td colSpan={7}>
                      <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse my-1" />
                    </td>
                  </tr>
                ))
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No applications found.
                  </td>
                </tr>
              ) : (
                admissions.map((a) => (
                  <tr key={a._id}>
                    <td className="font-medium text-gray-900 dark:text-white">
                      {a.studentName}
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {a.gradeApplying}
                      </span>
                    </td>
                    <td>{a.parentName}</td>
                    <td className="text-sm text-gray-500">{a.parentPhone}</td>
                    <td>
                      <span
                        className={`badge ${STATUS_COLORS[a.status]} capitalize`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(a)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
          admission={selected}
          onClose={() => setSelected(null)}
          onStatusChange={fetch}
        />
      )}
    </div>
  );
}
