import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import applicationsReducer from '../features/applications/applicationsSlice';

// ── Rehydrate auth from localStorage ────────────────────────
const persistedUser = localStorage.getItem('user');
const persistedToken = localStorage.getItem('token');

const preloadedState = {
  auth: {
    user: persistedUser ? JSON.parse(persistedUser) : null,
    token: persistedToken || null,
    status: 'idle',
    error: null,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
  },
  preloadedState,
});

export default store;
