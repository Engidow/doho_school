const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, unique: true },
  grade: { type: String, required: true },
  section: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female'] },
  parentName: { type: String },
  parentPhone: { type: String },
  email: { type: String },
  address: { type: String },
  photo: { type: String, default: '' },
  enrollmentDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  achievements: [{ type: String }]
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `DS${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
