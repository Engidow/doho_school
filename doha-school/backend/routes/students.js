const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @GET /api/students - get all (protected)
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, grade } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { studentId: { $regex: search, $options: 'i' } }];
    if (grade) query.grade = grade;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });

    res.json({ success: true, students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @POST /api/students
router.post('/', protect, uploadImage('students').single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/students/${req.file.filename}`;
    const student = await Student.create(data);
    res.status(201).json({ success: true, student });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @PUT /api/students/:id
router.put('/:id', protect, uploadImage('students').single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = `/uploads/students/${req.file.filename}`;
    const student = await Student.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @DELETE /api/students/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
