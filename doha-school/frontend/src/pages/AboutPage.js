import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAward, FiUsers, FiBook } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

const values = [
  { icon: HiOutlineAcademicCap, title: 'Excellence', desc: 'We uphold the highest academic standards in everything we do.' },
  { icon: HiOutlineHeart, title: 'Integrity', desc: 'We act with honesty, respect, and strong Islamic values.' },
  { icon: HiOutlineLightBulb, title: 'Innovation', desc: 'We embrace creative thinking and modern educational methods.' },
  { icon: HiOutlineGlobe, title: 'Community', desc: 'We serve our students, families, and the wider Somali community.' },
];

const timeline = [
  { year: '2009', event: 'School founded with 120 students and 8 teachers.' },
  { year: '2012', event: 'Expanded to secondary education, Grades 7–12.' },
  { year: '2015', event: 'Opened new science and computer laboratories.' },
  { year: '2018', event: 'Achieved 95%+ national exam pass rate for first time.' },
  { year: '2021', event: 'Launched digital learning initiative across all grades.' },
  { year: '2024', event: 'Serving 1,200+ students with 85+ qualified teachers.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="section-subheading text-primary-300 mb-3">About Us</p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">Our Story & Heritage</h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">15+ years of nurturing young minds and shaping futures in the heart of Mogadishu, Somalia.</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-subheading mb-3">Our History</p>
            <h2 className="section-heading mb-6">Founded on a Dream of Excellence</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Doha-Model Primary & Secondary School was established in 2009 with a clear vision: to provide Somali children with world-class education rooted in Islamic values and modern pedagogical practices.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              What began as a small school with 120 students has grown into a thriving educational institution serving over 1,200 students from Grade 1 through Grade 12. Our journey has been marked by continuous improvement, dedication, and an unwavering commitment to student success.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Today, Doha-Model School is recognized as one of Mogadishu's premier educational institutions, known for academic excellence, disciplined environment, and holistic student development.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FiUsers, label: '1,200+ Students' },
                { icon: FiAward, label: '85+ Teachers' },
                { icon: FiBook, label: 'Grades 1–12' },
                { icon: FiCheckCircle, label: '97% Pass Rate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <item.icon className="text-primary-600" size={20} />
                  <span className="font-semibold text-gray-800 dark:text-white text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-display font-bold mb-8 text-gold-400">Our Journey</h3>
              <div className="space-y-6">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gold-400/20 border-2 border-gold-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                      </div>
                      {i < timeline.length - 1 && <div className="w-0.5 h-full bg-white/10 mt-2"></div>}
                    </div>
                    <div className="pb-4">
                      <span className="text-gold-400 font-bold text-sm">{item.year}</span>
                      <p className="text-primary-100 text-sm mt-1">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Core Values</p>
            <h2 className="section-heading">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="card p-7 text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-600 transition-colors duration-300">
                  <v.icon size={26} className="text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">Ready to Join Us?</h2>
          <p className="text-primary-100 mb-8">Start your child's journey to excellence at Doha-Model School.</p>
          <Link to="/admissions" className="btn-primary">Apply for Admission</Link>
        </div>
      </section>
    </div>
  );
}
