import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiUser, FiUpload } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const GRADES = [...Array(12)].map((_,i) => `Grade ${i+1}`);

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg my-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><FiX size={18}/></button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'',grade:'',section:'',age:'',gender:'',parentName:'',parentPhone:'',email:'',address:'' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit:10 });
      if (search) params.append('search', search);
      if (grade) params.append('grade', grade);
      const { data } = await api.get(`/students?${params}`);
      setStudents(data.students); setTotal(data.total); setPages(data.pages);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [page, grade]);

  const openAdd = () => { setEditing(null); setForm({ name:'',grade:'Grade 1',section:'',age:'',gender:'Male',parentName:'',parentPhone:'',email:'',address:'' }); setPhotoFile(null); setPhotoPreview(null); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name:s.name,grade:s.grade,section:s.section||'',age:s.age||'',gender:s.gender||'Male',parentName:s.parentName||'',parentPhone:s.parentPhone||'',email:s.email||'',address:s.address||'' }); setPhotoPreview(s.photo ? `http://localhost:5000${s.photo}` : null); setPhotoFile(null); setShowModal(true); };

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader(); reader.onload = () => setPhotoPreview(reader.result); reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);

      if (editing) { await api.put(`/students/${editing._id}`, fd, { headers:{'Content-Type':'multipart/form-data'} }); toast.success('Student updated!'); }
      else { await api.post('/students', fd, { headers:{'Content-Type':'multipart/form-data'} }); toast.success('Student added!'); }
      setShowModal(false); fetchStudents();
    } catch(err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await api.delete(`/students/${id}`); toast.success('Deleted'); fetchStudents(); }
    catch { toast.error('Delete failed'); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Students</h2>
          <p className="text-gray-400 text-sm">{total} total students</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><FiPlus size={16}/>Add Student</button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={16}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-9 py-2.5 text-sm" placeholder="Search name or ID..." />
          </div>
          <button type="submit" className="btn-primary text-sm px-4 py-2">Search</button>
        </form>
        <select value={grade} onChange={e=>{setGrade(e.target.value);setPage(1);}} className="input-field text-sm w-auto py-2.5">
          <option value="">All Grades</option>
          {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Student</th><th>Grade</th><th>Parent</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i}><td colSpan={6}><div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse my-1"></div></td></tr>
              )) : students.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No students found.</td></tr>
              ) : students.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {s.photo ? <img src={`http://localhost:5000${s.photo}`} alt="" className="w-full h-full object-cover"/> : <FiUser size={14} className="text-primary-500"/>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{s.grade}</span></td>
                  <td className="text-sm">{s.parentName||'—'}</td>
                  <td className="text-sm">{s.parentPhone||'—'}</td>
                  <td><span className={s.isActive?'badge badge-green':'badge badge-red'}>{s.isActive?'Active':'Inactive'}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(s)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><FiEdit2 size={15}/></button>
                      <button onClick={()=>handleDelete(s._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
            {[...Array(pages)].map((_,i) => (
              <button key={i} onClick={()=>setPage(i+1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page===i+1?'bg-primary-600 text-white':'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{i+1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Student' : 'Add Student'} onClose={()=>setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview ? <img src={photoPreview} alt="" className="w-full h-full object-cover"/> : <FiUser size={24} className="text-gray-400"/>}
              </div>
              <div>
                <input type="file" ref={fileRef} onChange={handlePhoto} accept="image/*" className="hidden"/>
                <button type="button" onClick={()=>fileRef.current?.click()} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  <FiUpload size={14}/> Upload Photo
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field text-sm py-2.5" placeholder="Student's full name"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Grade *</label>
                <select required value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} className="input-field text-sm py-2.5">
                  {GRADES.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gender</label>
                <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} className="input-field text-sm py-2.5">
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Section</label>
                <input value={form.section} onChange={e=>setForm({...form,section:e.target.value})} className="input-field text-sm py-2.5" placeholder="e.g. A"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Age</label>
                <input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} className="input-field text-sm py-2.5" placeholder="Age"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Parent Name</label>
                <input value={form.parentName} onChange={e=>setForm({...form,parentName:e.target.value})} className="input-field text-sm py-2.5" placeholder="Parent's name"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Parent Phone</label>
                <input value={form.parentPhone} onChange={e=>setForm({...form,parentPhone:e.target.value})} className="input-field text-sm py-2.5" placeholder="+252..."/>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field text-sm py-2.5" placeholder="Optional"/>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={()=>setShowModal(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
