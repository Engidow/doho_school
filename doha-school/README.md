# 🏫 Doha-Model Primary & Secondary School — MERN Stack Website

A complete, production-ready school management system and public website built with the MERN stack.

---

## 📋 Project Structure

```
doha-school/
├── backend/          # Node.js + Express REST API
│   ├── models/       # MongoDB Mongoose models
│   ├── routes/       # API route handlers
│   ├── middleware/   # Auth, upload, error handlers
│   ├── utils/        # Seed script
│   ├── uploads/      # Uploaded images (auto-created)
│   └── server.js     # Entry point
│
└── frontend/         # React.js application
    ├── src/
    │   ├── pages/        # All page components
    │   │   └── admin/    # Admin dashboard pages
    │   ├── layouts/      # MainLayout & AdminLayout
    │   ├── context/      # Redux store
    │   ├── services/     # Axios API service
    │   └── index.css     # Tailwind + global styles
    └── public/
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed default admin account
npm run seed

# Start development server
npm run dev
```

The API runs on **http://localhost:5000**

---

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The website runs on **http://localhost:3000**

---

## 🔐 Default Admin Credentials

After running `npm run seed` in the backend:

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@dohaschool.com     |
| Password | Admin@123                |
| Role     | Super Admin              |

> ⚠️ **Change the password immediately after first login!**

---

## 🌐 Public Pages

| Route          | Description              |
|----------------|--------------------------|
| `/`            | Home page                |
| `/about`       | About the school         |
| `/academics`   | Curriculum & programs    |
| `/teachers`    | Teaching staff           |
| `/admissions`  | Apply for admission      |
| `/events`      | School events            |
| `/gallery`     | Photo gallery            |
| `/contact`     | Contact form & info      |

---

## 🔒 Admin Dashboard (`/admin`)

| Route                 | Description          |
|-----------------------|----------------------|
| `/admin`              | Dashboard & stats    |
| `/admin/students`     | Manage students      |
| `/admin/teachers`     | Manage teachers      |
| `/admin/admissions`   | Admission requests   |
| `/admin/events`       | School events        |
| `/admin/gallery`      | Photo gallery        |
| `/admin/notices`      | School notices       |
| `/admin/contacts`     | Contact messages     |

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** — UI library
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Redux Toolkit** — State management
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **React Hot Toast** — Notifications
- **React Icons** — Icon library
- **React CountUp** — Animated counters

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **Multer** — File upload handling
- **express-validator** — Input validation
- **Morgan** — HTTP request logging

---

## 📡 API Endpoints

### Auth
| Method | Endpoint               | Access   |
|--------|------------------------|----------|
| POST   | `/api/auth/login`      | Public   |
| GET    | `/api/auth/me`         | Private  |
| POST   | `/api/auth/register`   | Public*  |
| PUT    | `/api/auth/change-password` | Private |

### Students
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | `/api/students`       | Private |
| POST   | `/api/students`       | Private |
| PUT    | `/api/students/:id`   | Private |
| DELETE | `/api/students/:id`   | Private |

### Teachers
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | `/api/teachers`       | Public  |
| GET    | `/api/teachers/all`   | Private |
| POST   | `/api/teachers`       | Private |
| PUT    | `/api/teachers/:id`   | Private |
| DELETE | `/api/teachers/:id`   | Private |

*And similar for admissions, events, gallery, contacts, notices*

---

## 🎨 Features

### Public Website
- ✅ Modern hero section with animations
- ✅ Responsive navbar with dark/light mode
- ✅ School statistics with count-up animations
- ✅ About, Vision & Mission sections
- ✅ Principal's message
- ✅ Subjects & curriculum overview
- ✅ Teacher showcase
- ✅ Testimonials section
- ✅ Admission application form
- ✅ Events calendar with filtering
- ✅ Photo gallery with lightbox
- ✅ Contact form with Google Maps
- ✅ Professional footer
- ✅ Dark mode support
- ✅ Fully responsive (mobile, tablet, desktop)

### Admin Dashboard
- ✅ Secure JWT authentication
- ✅ Dashboard with real-time statistics
- ✅ Student CRUD with photo upload
- ✅ Teacher CRUD with photo upload & featured toggle
- ✅ Admission management with status updates
- ✅ Events management with image upload
- ✅ Gallery management with category filtering
- ✅ Notice board management
- ✅ Contact messages with read/unread tracking
- ✅ Responsive sidebar navigation
- ✅ Dark mode support

---

## 🏫 School Information

- **Name:** Doha-Model Primary & Secondary School
- **Location:** Tabeelaha Sheekh Ibraahim, Mogadishu, Somalia
- **Phone:** +252 61 4555518
- **Email:** doohaschool@gmail.com
- **Grades:** 1 – 12 (Primary & Secondary)

---

## 📦 Production Deployment

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/doha_school
JWT_SECRET=your_very_secure_random_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Deploy the /build folder to your hosting (Vercel, Netlify, etc.)
```

### Deploy Backend
```bash
# Deploy to Railway, Render, Heroku, or VPS
# Make sure to set all environment variables
```

---

## 📝 License

Built for Doha-Model Primary & Secondary School, Mogadishu, Somalia.
