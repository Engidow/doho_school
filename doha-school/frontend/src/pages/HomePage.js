import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      count: "1,200+",
      label: "Arday",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-green-500" />,
      count: "45+",
      label: "Macalimiin",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      count: "18+",
      label: "Maadooyin",
    },
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      count: "15+",
      label: "Guulo",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-blue-500/30"
          >
            Kusoo Dhawaada Doha-Model School
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
          >
            U Diyaari Ilmahaaga{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              {" "}
              mustaqbal ifaya{" "}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Waxaan bixinaa waxbarasho tayo sare leh oo ku dax xidhan
            tignoolajiyada casriga ah iyo anshax suuban.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link
              to="/admissions"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
            >
              Codso Hada <ArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-3.5 rounded-xl font-medium transition-all"
            >
              Sii Akhri
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 text-center space-y-2 border-r last:border-r-0 border-slate-100 dark:border-slate-700"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner">
                {stat.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                {stat.count}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Message from Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 scale-95 opacity-10" />
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800"
              alt="Principal"
              className="rounded-2xl shadow-xl w-full object-cover max-h-[450px]"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Farriinta Maamulaha Dugsiga
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              "Ku soo dhowaada bogga internet-ka ee Doha-Model School. Waxaa
              sharaf weyn noo ah inaan hogaamino machadkan u taagan barbaarinta
              saxda ah iyo soo saarista hogaamiyayaasha berri. Waxaan mar walba
              ku dadaalnaa inaan ardaydayada siino jawi ammaan ah oo ay ka heli
              karaan aqoon tayeysan."
            </p>
            <div className="pt-2">
              <h4 className="font-bold text-lg">Maamulaha Guud</h4>
              <p className="text-sm text-slate-400">Doha-Model School</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
