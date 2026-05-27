// admissions.js
const express = require('express');
const router = express.Router();
const { Admission } = require('../models/index');
const { protect } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({ success: true, message: 'Application submitted successfully!', admission });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const total = await Admission.countDocuments(query);
    const admissions = await Admission.find(query).skip((page-1)*limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, admissions, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, admission });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
