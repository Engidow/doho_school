import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { delay: i*0.1, duration: 0.6 } }) };

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/contacts', form);
      toast.success('Message sent!'); setSent(true);
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">Contact Us</h1>
          <p className="text-primary-100 text-lg">We're here to help. Reach out with any questions or inquiries.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
              <h2 className="section-heading mb-6">School Information</h2>
              {[
                { icon: FiPhone, label:'Phone', value:'+252 61 4555518', href:'tel:+252614555518', color:'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
                { icon: FiMail, label:'Email', value:'doohaschool@gmail.com', href:'mailto:doohaschool@gmail.com', color:'bg-green-50 dark:bg-green-900/20 text-green-600' },
                { icon: FiMapPin, label:'Address', value:'Tabeelaha Sheekh Ibraahim, Mogadishu, Somalia', href:null, color:'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
                { icon: FiClock, label:'School Hours', value:'Monday–Friday: 7:30 AM – 2:30 PM', href:null, color:'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 card">
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors text-sm">{item.value}</a>
                      : <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-red-700 dark:text-red-400 text-sm">Currently Closed</span>
              </div>
              <p className="text-red-600 dark:text-red-300 text-xs">School is currently outside operating hours. We'll respond to messages on the next business day.</p>
            </div>
          </div>

          {/* Form */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{once:true}} className="lg:col-span-3">
            {sent ? (
              <div className="card p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you for reaching out. We'll reply within 24–48 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); }} className="btn-secondary text-sm">Send Another Message</button>
              </div>
            ) : (
              <div className="card p-8">
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name *</label>
                      <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                      <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-field" placeholder="+252 61 xxxxxxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                      <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="input-field" placeholder="What's this about?" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
                    <textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={6} className="input-field resize-none" placeholder="Write your message here..."></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending...</> : <><FiSend size={16}/>Send Message</>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* Map */}
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="card overflow-hidden rounded-2xl h-72">
            <iframe title="School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125988.55!2d45.2345!3d2.0469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58430c4fda46eb%3A0x8b5823cc27db7b7!2sMogadishu%2C+Somalia!5e0!3m2!1sen!2s!4v1234567890"
              width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
