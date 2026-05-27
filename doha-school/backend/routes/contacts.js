// contacts.js
const express = require('express');
const router = express.Router();
const { Contact } = require('../models/index');
const { protect } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully!', contact });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const query = isRead !== undefined ? { isRead: isRead === 'true' } : {};
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).skip((page-1)*limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ success: true, contacts, total, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, contact });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
