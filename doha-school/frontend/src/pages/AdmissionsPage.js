import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiUser, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

const steps = [
  { step: '01', title: 'Submit Application', desc: 'Fill out the online form below with your child\'s and parent\'s details.' },
  { step: '02', title: 'Document Review', desc: 'We review your application and required documents within 3–5 business days.' },
  { step: '03', title: 'Entrance Assessment', desc: 'Student attends a brief assessment appropriate for their grade level.' },
  { step: '04', title: 'Enrollment', desc: 'Receive acceptance letter and complete enrollment with registration fee.' },
];

export default function AdmissionsPage() {
  const [form, setForm] = useState({ studentName: '', parentName: '', parentEmail: '', parentPhone: '', gradeApplying: '', previousSchool: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admissions', form);
      toast.success('Application submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">Join Our Family</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">Admissions 2024</h1>
          <p className="text-primary-100 text-lg">Applications are now open for Grades 1–12. Secure your child's place today.</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">How to Apply</p>
            <h2 className="section-heading">Admission Process</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-7 relative">
                <div className="text-5xl font-display font-bold text-primary-100 dark:text-primary-900 mb-4">{s.step}</div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-3">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary-600 rounded-full items-center justify-center z-10">
                    <FiArrowRight size={12} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-subheading mb-3">Requirements</p>
            <h2 className="section-heading mb-6">What You'll Need</h2>
            <div className="space-y-4">
              {[
                'Birth certificate of student',
                'Previous school report cards',
                'Parent/guardian national ID',
                'Passport-size photographs (4)',
                'Transfer certificate (if applicable)',
                'Medical records (if applicable)',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <FiCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
              <h4 className="font-bold text-primary-800 dark:text-primary-200 mb-2">Available Grades</h4>
              <div className="flex flex-wrap gap-2">
                {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                  <span key={g} className="badge badge-blue">{g}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {submitted ? (
              <div className="card p-10 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">Application Received!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">We've received your application and will contact you within 3–5 business days.</p>
                <p className="text-sm text-gray-400">Questions? Call us: <a href="tel:+252614555518" className="text-primary-600 font-semibold">+252 61 4555518</a></p>
                <button onClick={() => setSubmitted(false)} className="mt-6 btn-secondary text-sm">Submit Another</button>
              </div>
            ) : (
              <div className="card p-8">
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Application Form</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student Name *</label>
                      <div className="relative"><FiUser className="absolute left-3 top-3.5 text-gray-400" size={16} />
                        <input name="studentName" required value={form.studentName} onChange={handleChange} className="input-field pl-9" placeholder="Full name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Applying For *</label>
                      <div className="relative"><FiBook className="absolute left-3 top-3.5 text-gray-400" size={16} />
                        <select name="gradeApplying" required value={form.gradeApplying} onChange={handleChange} className="input-field pl-9">
                          <option value="">Select Grade</option>
                          {[...Array(12)].map((_, i) => <option key={i+1} value={`Grade ${i+1}`}>Grade {i+1}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parent/Guardian Name *</label>
                    <input name="parentName" required value={form.parentName} onChange={handleChange} className="input-field" placeholder="Parent's full name" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parent Email *</label>
                      <div className="relative"><FiMail className="absolute left-3 top-3.5 text-gray-400" size={16} />
                        <input type="email" name="parentEmail" required value={form.parentEmail} onChange={handleChange} className="input-field pl-9" placeholder="email@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                      <div className="relative"><FiPhone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                        <input name="parentPhone" required value={form.parentPhone} onChange={handleChange} className="input-field pl-9" placeholder="+252 61 xxxxxxx" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous School (if any)</label>
                    <input name="previousSchool" value={form.previousSchool} onChange={handleChange} className="input-field" placeholder="Previous school name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Any additional information..."></textarea>
                  </div>

                  <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <>Submit Application <FiArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
