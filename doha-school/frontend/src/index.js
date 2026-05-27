import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './context/store';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', background: '#1e3a8a', color: '#fff', fontFamily: 'Plus Jakarta Sans' },
          success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
          error: { style: { background: '#dc2626' } },
        }}
      />
    </Provider>
  </React.StrictMode>
);
