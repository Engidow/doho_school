const express = require('express');
const router = express.Router();
const { Gallery } = require('../models/index');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    let q = Gallery.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));
    const gallery = await q;
    res.json({ success: true, gallery });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, gallery });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, uploadImage('gallery').single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const data = { ...req.body, image: `/uploads/gallery/${req.file.filename}` };
    const item = await Gallery.create(data);
    res.status(201).json({ success: true, item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, uploadImage('gallery').single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/gallery/${req.file.filename}`;
    const item = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
