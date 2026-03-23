import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Async Thunks ────────────────────────────────────────────

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password, role });
      const { user, token } = response.data;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Signup failed. Please try again.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed. Please try again.');
    }
  }
);

// ── Slice ───────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,       // { id, name, email, role }
    token: null,      // JWT string
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,      // string | null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── signupUser ──────────────────────────────────────────
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── loginUser ───────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// ── Selectors ───────────────────────────────────────────────
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUserRole = (state) => state.auth.user?.role || null;

export default authSlice.reducer;
