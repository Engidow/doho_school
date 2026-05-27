// AcademicsPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { delay: i*0.1, duration: 0.6 } }) };

const levels = [
  {
    level: 'Primary School', grades: 'Grades 1–6', icon: '📚', color: 'from-blue-500 to-blue-700',
    desc: 'Building strong foundations in literacy, numeracy, and character development for ages 6–12.',
    subjects: ['Mathematics','English','Somali Language','Science','Social Studies','Islamic Studies','Physical Education','Arts & Crafts'],
  },
  {
    level: 'Secondary School', grades: 'Grades 7–12', icon: '🎓', color: 'from-primary-600 to-primary-800',
    desc: 'Advanced academic preparation for national exams and higher education for ages 13–18.',
    subjects: ['Advanced Mathematics','Physics','Chemistry','Biology','English Literature','Geography','History','Computer Science','Islamic Studies','Physical Education'],
  },
];

export default function AcademicsPage() {
  return (
    <div>
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="section-subheading text-primary-300 mb-3">Curriculum</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">Academic Programs</h1>
          <p className="text-primary-100 text-lg">Comprehensive, standards-aligned education from Grade 1 through Grade 12.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {levels.map((l, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{once:true}}
              className="card overflow-hidden">
              <div className={`bg-gradient-to-r ${l.color} p-8 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{l.icon}</div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">{l.level}</h2>
                    <p className="text-white/80">{l.grades}</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{l.desc}</p>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiBook className="text-primary-600" /> Subjects Offered
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {l.subjects.map(s => (
                    <div key={s} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm">
                      <FiCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                      <span className="text-gray-700 dark:text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra-curricular */}
        <div className="max-w-7xl mx-auto px-4 mt-16">
          <div className="text-center mb-10">
            <p className="section-subheading mb-3">Beyond the Classroom</p>
            <h2 className="section-heading">Extra-Curricular Activities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji:'⚽', name:'Football Club' },
              { emoji:'📖', name:'Debate Club' },
              { emoji:'🎨', name:'Art & Design' },
              { emoji:'🔬', name:'Science Club' },
              { emoji:'📐', name:'Math Olympiad' },
              { emoji:'🎭', name:'Drama & Theatre' },
              { emoji:'🏃', name:'Athletics' },
              { emoji:'💻', name:'Coding Club' },
            ].map((a, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{once:true}}
                className="card p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">{a.emoji}</div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{a.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
