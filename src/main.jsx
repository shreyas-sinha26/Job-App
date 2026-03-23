import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import AppRouter from './routes/AppRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            borderRadius: 'var(--radius-input)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            style: {
              background: 'var(--success-light)',
              color: 'var(--success)',
              border: '1px solid var(--success)',
            },
          },
          error: {
            style: {
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              border: '1px solid var(--danger)',
            },
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);
