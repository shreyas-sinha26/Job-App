import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ═══════════════════════════════════════════════════════════════
//   Async Thunks
// ═══════════════════════════════════════════════════════════════

/** Fetch all jobs with optional filters */
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.type) params.set('type', filters.type);
      if (filters.location) params.set('location', filters.location);
      if (filters.experience) params.set('experience', filters.experience);

      const response = await api.get(`/jobs?${params.toString()}`);
      return response.data; // { jobs, total }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch jobs.');
    }
  }
);

/** Fetch a single job by ID */
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data; // { job }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch job details.');
    }
  }
);

/** Create a new job (employer) */
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data; // { job }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create job.');
    }
  }
);

/** Update an existing job (employer) */
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${id}`, updates);
      return response.data; // { job }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update job.');
    }
  }
);

/** Delete a job (employer) */
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}`);
      return id; // Return id so reducer can remove it from state
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete job.');
    }
  }
);

// ═══════════════════════════════════════════════════════════════
//   Slice
// ═══════════════════════════════════════════════════════════════

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],            // [ Job ]
    selectedJob: null,    // Job | null
    status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
    detailStatus: 'idle', // For single job fetch
    createStatus: 'idle', // For create/update/delete
    error: null,          // string | null
    filters: {
      search: '',
      location: '',
      type: '',
      experience: '',
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { search: '', location: '', type: '', experience: '' };
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
      state.detailStatus = 'idle';
    },
    clearJobsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchJobs ──────────────────────────────────────────────
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.jobs;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── fetchJobById ───────────────────────────────────────────
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedJob = action.payload.job;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      });

    // ── createJob ──────────────────────────────────────────────
    builder
      .addCase(createJob.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items.unshift(action.payload.job);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      });

    // ── updateJob ──────────────────────────────────────────────
    builder
      .addCase(updateJob.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const idx = state.items.findIndex((j) => j.id === action.payload.job.id);
        if (idx !== -1) state.items[idx] = action.payload.job;
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      });

    // ── deleteJob ──────────────────────────────────────────────
    builder
      .addCase(deleteJob.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items = state.items.filter((j) => j.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedJob, clearJobsError } = jobsSlice.actions;

// ── Selectors ───────────────────────────────────────────────
export const selectAllJobs = (state) => state.jobs.items;
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectJobsStatus = (state) => state.jobs.status;
export const selectJobDetailStatus = (state) => state.jobs.detailStatus;
export const selectJobCreateStatus = (state) => state.jobs.createStatus;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobFilters = (state) => state.jobs.filters;

export default jobsSlice.reducer;
