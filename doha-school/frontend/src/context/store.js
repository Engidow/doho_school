import { configureStore, createSlice } from '@reduxjs/toolkit';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.admin = payload.admin;
      state.token = payload.token;
      localStorage.setItem('admin', JSON.stringify(payload.admin));
      localStorage.setItem('token', payload.token);
    },
    logout(state) {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('admin');
      localStorage.removeItem('token');
    },
    setLoading(state, { payload }) { state.isLoading = payload; },
  },
});

// Theme Slice
const themeSlice = createSlice({
  name: 'theme',
  initialState: { isDark: localStorage.getItem('theme') === 'dark' },
  reducers: {
    toggleTheme(state) {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.isDark);
    },
    initTheme(state) {
      document.documentElement.classList.toggle('dark', state.isDark);
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export const { toggleTheme, initTheme } = themeSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
  },
});
