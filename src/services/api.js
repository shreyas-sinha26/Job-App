import axios from 'axios';
import store from '../app/store';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

// ── Human-readable error messages ───────────────────────────
const ERROR_MESSAGES = {
  400: 'Invalid request. Please check your input.',
  401: 'Session expired. Please sign in again.',
  403: "You don't have access to this page.",
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'Please check your input and try again.',
  429: 'Too many requests. Please try again in a moment.',
  500: 'Something went wrong on our end. Please try again.',
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: attach Bearer token ────────────────
api.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle errors globally ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 → silent logout + redirect
    if (status === 401) {
      toast.error('Session expired. Please sign in again.');
      store.dispatch(logout());
      // Redirect will be handled by PrivateRoute re-render
    }

    if (!error.response && error.request) {
      toast.error('Something went wrong. Please try again.');
    }

    // Normalise the error message
    const serverMessage = error.response?.data?.message;
    const humanMessage =
      serverMessage || ERROR_MESSAGES[status] || 'An unexpected error occurred. Please try again.';

    // Return a rejected promise with a normalised error
    return Promise.reject({
      status,
      message: humanMessage,
      raw: error,
    });
  }
);

export default api;
