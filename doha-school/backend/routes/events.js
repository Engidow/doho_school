const express = require('express');
const router = express.Router();
const { Event } = require('../models/index');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { limit, category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    let q = Event.find(query).sort({ date: -1 });
    if (limit) q = q.limit(Number(limit));
    const events = await q;
    res.json({ success: true, events });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ success: true, events });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, uploadImage('events').single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/events/${req.file.filename}`;
    const event = await Event.create(data);
    res.status(201).json({ success: true, event });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, uploadImage('events').single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/events/${req.file.filename}`;
    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, event });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
