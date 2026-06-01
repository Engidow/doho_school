// ✅ DELETE BASE_URL - MA HAYSATID
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ KU DAR FUNCTION-KAN
const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;  // Supabase URL - toos celi
  }
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return `${BASE_URL}${photo}`;  // Local - BASE_URL ku dar
};

function TeacherCard({ teacher, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card p-6 text-center group hover:-translate-y-2 transition-all duration-300"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
        {teacher?.photo ? (
          <img
            src={getImageUrl(teacher.photo)}   {/* ✅ BEDDESHAY */}
            alt={teacher?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <FiUser size={32} className="text-primary-500" />
        )}
      </div>

      {/* Hadda kale wax ha bedelin */}
      <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">
        {teacher?.name}
      </h3>
      <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">
        {teacher?.subject}
      </p>
      {/* ... etc */}
    </motion.div>
  );
}