import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiUpload, FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg my-4">
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

const emptyForm = { name: '', subject: '', qualification: '', experience: '', email: '', phone: '', bio: '', featured: false };

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetch = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/teachers/all?search=${q}`);
      setTeachers(data.teachers); setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPhotoFile(null); setPhotoPreview(null); setShowModal(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, qualification: t.qualification || '', experience: t.experience || '', email: t.email || '', phone: t.phone || '', bio: t.bio || '', featured: t.featured || false });
    setPhotoPreview(t.photo ? `http://localhost:5000${t.photo}` : null);
    setPhotoFile(null); setShowModal(true);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader(); reader.onload = () => setPhotoPreview(reader.result); reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (editing) { await api.put(`/teachers/${editing._id}`, fd, { headers }); toast.success('Teacher updated!'); }
      else { await api.post('/teachers', fd, { headers }); toast.success('Teacher added!'); }
      setShowModal(false); fetch(search);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try { await api.delete(`/teachers/${id}`); toast.success('Deleted'); fetch(search); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Teachers</h2>
          <p className="text-gray-400 text-sm">{total} total teachers</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16} />Add Teacher</button>
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetch(search)}
            className="input-field pl-9 py-2.5 text-sm" placeholder="Search by name or subject..." />
        </div>
        <button onClick={() => fetch(search)} className="btn-primary text-sm px-4 py-2">Search</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? [...Array(8)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-1/2" />
          </div>
        )) : teachers.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">No teachers found.</div>
        ) : teachers.map(t => (
          <div key={t._id} className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
              {t.photo ? <img src={`http://localhost:5000${t.photo}`} alt={t.name} className="w-full h-full object-cover" />
                : <FiUser size={26} className="text-primary-500" />}
            </div>
            {t.featured && <span className="badge badge-yellow mb-2">Featured</span>}
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t.name}</h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-1">{t.subject}</p>
            {t.qualification && <p className="text-gray-400 text-xs mb-1">{t.qualification}</p>}
            {t.experience && <p className="text-gray-400 text-xs mb-4">{t.experience}</p>}
            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 transition-colors"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Teacher' : 'Add Teacher'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview ? <img src={photoPreview} alt="" className="w-full h-full object-cover" /> : <FiUser size={24} className="text-gray-400" />}
              </div>
              <div>
                <input type="file" ref={fileRef} onChange={handlePhoto} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-sm text-primary-600 font-medium"><FiUpload size={14} />Upload Photo</button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field text-sm py-2.5" placeholder="Teacher's name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject *</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field text-sm py-2.5" placeholder="e.g. Mathematics" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Qualification</label>
                <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="input-field text-sm py-2.5" placeholder="e.g. BSc Mathematics" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Experience</label>
                <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field text-sm py-2.5" placeholder="e.g. 5 years" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field text-sm py-2.5" placeholder="+252..." />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm py-2.5" placeholder="teacher@school.com" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="input-field text-sm py-2.5 resize-none" placeholder="Short bio..." />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Feature on homepage</label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add Teacher'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
