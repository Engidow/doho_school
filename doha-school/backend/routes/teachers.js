const express = require('express');
const router = express.Router();
const { Teacher } = require('../models/index');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @GET /api/teachers - public
router.get('/', async (req, res) => {
  try {
    const { featured, limit } = req.query;
    const query = { isActive: true };
    if (featured === 'true') query.featured = true;
    let q = Teacher.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));
    const teachers = await q;
    res.json({ success: true, teachers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/teachers/all - protected admin view
router.get('/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { subject: { $regex: search, $options: 'i' } }];
    const total = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query).skip((page-1)*limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, teachers, total, page: Number(page), pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @POST /api/teachers
router.post('/', protect, uploadImage('teachers').single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/teachers/${req.file.filename}`;
    const teacher = await Teacher.create(data);
    res.status(201).json({ success: true, teacher });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @PUT /api/teachers/:id
router.put('/:id', protect, uploadImage('teachers').single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/teachers/${req.file.filename}`;
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, teacher });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @DELETE /api/teachers/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
