import axios from "axios";
import { store, logout } from "../context/store";

const api = axios.create({
  // Kani wuxuu hubinayaa REACT_APP marka hore ee Render, ka dib VITE, ka dibna caadiga
  baseURL:
    process.env.REACT_APP_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "https://doha-school.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
