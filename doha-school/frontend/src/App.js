import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initTheme } from "./context/store";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import AcademicsPage from "./pages/AcademicsPage";
import TeachersPage from "./pages/TeachersPage";
import GalleryPage from "./pages/GalleryPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminNotices from "./pages/admin/AdminNotices";

// Layout
import MainLayout from "./layouts/MainLayout";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return (
    /* WAXAA HALKAN LAGU DARAY FUTURE FLAGS SI DIGNIINTA LOO DAMIYO */
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="admissions" element={<AdminAdmissions />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="notices" element={<AdminNotices />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
