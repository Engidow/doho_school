import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBell } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['general', 'academic', 'exam', 'holiday', 'urgent'];
const CAT_COLORS = { general: 'badge-blue', academic: 'badge-green', exam: 'badge-yellow', holiday: 'badge-blue', urgent: 'badge-red' };
const emptyForm = { title: '', content: '', category: 'general', isPublished: true, expiryDate: '' };

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><FiX size={18} /></button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try { const { data } = await api.get('/notices/all'); setNotices(data.notices); }
    catch { toast.error('Failed to load notices'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (n) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, category: n.category, isPublished: n.isPublished, expiryDate: n.expiryDate?.slice(0, 10) || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/notices/${editing._id}`, form); toast.success('Notice updated!'); }
      else { await api.post('/notices', form); toast.success('Notice posted!'); }
      setShowModal(false); fetchNotices();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await api.delete(`/notices/${id}`); toast.success('Deleted'); fetchNotices(); }
    catch { toast.error('Delete failed'); }
  };

  const togglePublish = async (n) => {
    try {
      await api.put(`/notices/${n._id}`, { isPublished: !n.isPublished });
      toast.success(n.isPublished ? 'Unpublished' : 'Published');
      fetchNotices();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notices</h2>
          <p className="text-gray-400 text-sm">{notices.length} total notices</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} />Add Notice</button>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : notices.length === 0 ? (
        <div className="card p-16 text-center">
          <FiBell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">No notices yet. Post your first notice!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map(n => (
            <div key={n._id} className={`card p-5 flex items-start gap-4 ${!n.isPublished ? 'opacity-60' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.category === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-500'}`}>
                <FiBell size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{n.title}</h3>
                  <span className={`badge ${CAT_COLORS[n.category] || 'badge-blue'} capitalize`}>{n.category}</span>
                  {!n.isPublished && <span className="badge badge-red">Draft</span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{n.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Posted: {new Date(n.createdAt).toLocaleDateString()}</span>
                  {n.expiryDate && <span>Expires: {new Date(n.expiryDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${n.isPublished ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                  {n.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(n)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"><FiEdit2 size={15} /></button>
                <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Notice' : 'Post Notice'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field text-sm py-2.5" placeholder="Notice title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Content *</label>
              <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="input-field text-sm py-2.5 resize-none" placeholder="Notice content..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field text-sm py-2.5">
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="input-field text-sm py-2.5" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pubn" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 accent-primary-600" />
              <label htmlFor="pubn" className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Notice' : 'Post Notice'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
