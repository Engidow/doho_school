import axios from "axios";
import { store, logout } from "../context/store";

const api = axios.create({
  // Waxaan saxnay Link-ga rasmiga ah ee Backend-kaaga Render (lagu daray -backend)
  baseURL:
    process.env.REACT_APP_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "https://doha-school-backend.onrender.com/api",
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
    // Haddii uu yahay 401 laakiin uusan joogin bogga login-ka laftiisa
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
