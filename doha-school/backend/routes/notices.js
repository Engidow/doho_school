const express = require('express');
const router = express.Router();
const { Notice } = require('../models/index');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { limit, category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    let q = Notice.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));
    const notices = await q;
    res.json({ success: true, notices });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, notice });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, notice });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
