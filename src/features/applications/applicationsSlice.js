import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ═══════════════════════════════════════════════════════════════
//   Async Thunks
// ═══════════════════════════════════════════════════════════════

/** Fetch applications for the current jobseeker */
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications');
      return response.data; // { applications, total }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch applications.');
    }
  }
);

/** Fetch all applications for employer's jobs */
export const fetchEmployerApplications = createAsyncThunk(
  'applications/fetchEmployerApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications');
      return response.data; // { applications, total }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch applications.');
    }
  }
);

/** Update application status (employer action) */
export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/applications/${id}`, { status });
      return response.data; // { application }

    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update status.');
    }
  }
);

// ═══════════════════════════════════════════════════════════════
//   Slice
// ═══════════════════════════════════════════════════════════════

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],        // [ Application ]
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,      // string | null
  },
  reducers: {
    clearApplicationsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchApplications ──────────────────────────────────────
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.applications;
        state.error = null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── fetchEmployerApplications ──────────────────────────────
    builder
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.applications;
        state.error = null;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── updateApplicationStatus ────────────────────────────────
    builder
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload.application;
        const idx = state.items.findIndex((a) => a.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearApplicationsError } = applicationsSlice.actions;

// ── Selectors ───────────────────────────────────────────────
export const selectAllApplications = (state) => state.applications.items;
export const selectApplicationsStatus = (state) => state.applications.status;
export const selectApplicationsError = (state) => state.applications.error;

export default applicationsSlice.reducer;
