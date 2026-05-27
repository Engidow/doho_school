const mongoose = require('mongoose');

// Teacher Model
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  email: { type: String },
  phone: { type: String },
  photo: { type: String, default: '' },
  bio: { type: String },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  socialLinks: {
    linkedin: String,
    twitter: String
  }
}, { timestamps: true });

// Admission Model
const admissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  gradeApplying: { type: String, required: true },
  previousSchool: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'waitlisted'], default: 'pending' },
  appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Event Model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String },
  category: { type: String, enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'other'], default: 'other' },
  image: { type: String, default: '' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// Gallery Model
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  category: { type: String, enum: ['events', 'classroom', 'sports', 'graduation', 'campus', 'other'], default: 'other' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// Contact Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isReplied: { type: Boolean, default: false }
}, { timestamps: true });

// Notice Model
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['general', 'academic', 'exam', 'holiday', 'urgent'], default: 'general' },
  isPublished: { type: Boolean, default: true },
  publishDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }
}, { timestamps: true });

module.exports.Teacher = mongoose.model('Teacher', teacherSchema);
module.exports.Admission = mongoose.model('Admission', admissionSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Gallery = mongoose.model('Gallery', gallerySchema);
module.exports.Contact = mongoose.model('Contact', contactSchema);
module.exports.Notice = mongoose.model('Notice', noticeSchema);
