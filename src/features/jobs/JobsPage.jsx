import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchJobs,
  setFilters,
  clearFilters,
  selectAllJobs,
  selectJobsStatus,
  selectJobsError,
  selectJobFilters,
} from './jobsSlice';
import JobCard, { JobCardSkeleton } from './JobCard';
import './JobsPage.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];
const LOCATIONS = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai'];

export default function JobsPage() {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const status = useSelector(selectJobsStatus);
  const error = useSelector(selectJobsError);
  const filters = useSelector(selectJobFilters);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch jobs when filters change
  useEffect(() => {
    dispatch(fetchJobs({ ...filters, sortBy }));
  }, [dispatch, filters, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput }));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch, filters.search]);

  const handleFilterChange = useCallback(
    (key, value) => {
      dispatch(setFilters({ [key]: value === filters[key] ? '' : value }));
    },
    [dispatch, filters]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchInput('');
  }, [dispatch]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="jobs-page page-enter">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="jobs-sidebar" id="jobs-sidebar">
        <div className="jobs-sidebar__header">
          <h2 className="jobs-sidebar__title font-display">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              className="jobs-sidebar__clear btn btn--ghost btn--sm"
              onClick={handleClearFilters}
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="jobs-sidebar__section">
          <label className="jobs-sidebar__label" htmlFor="job-search">
            Search
          </label>
          <div className="jobs-sidebar__search-wrap">
            <svg className="jobs-sidebar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              id="job-search"
              type="text"
              className="input jobs-sidebar__search-input"
              placeholder="Role, company, skill…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="jobs-sidebar__section">
          <h3 className="jobs-sidebar__label">Job Type</h3>
          <div className="jobs-sidebar__chips">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                className={`jobs-sidebar__chip ${
                  (filters.type || []).includes(type) ? 'jobs-sidebar__chip--active' : ''
                }`}
                onClick={() => {
                  const current = filters.type || [];
                  const updated = current.includes(type)
                    ? current.filter(t => t !== type)
                    : [...current, type];
                  dispatch(setFilters({ type: updated }));
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="jobs-sidebar__section">
          <h3 className="jobs-sidebar__label">Experience</h3>
          <div className="jobs-sidebar__chips">
            {EXPERIENCE_LEVELS.map((exp) => (
              <button
                key={exp}
                className={`jobs-sidebar__chip ${
                  filters.experience === exp ? 'jobs-sidebar__chip--active' : ''
                }`}
                onClick={() => handleFilterChange('experience', exp)}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="jobs-sidebar__section">
          <h3 className="jobs-sidebar__label">Location</h3>
          <div className="jobs-sidebar__chips">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                className={`jobs-sidebar__chip ${
                  filters.location === loc ? 'jobs-sidebar__chip--active' : ''
                }`}
                onClick={() => handleFilterChange('location', loc)}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="jobs-main">
        {/* Header */}
        <div className="jobs-main__header">
          <div>
            <h1 className="text-h1 font-display">Open Roles</h1>
            <p className="jobs-main__subtitle text-body">
              {status === 'succeeded' && `${jobs.length} ${jobs.length === 1 ? 'position' : 'positions'} found`}
              {status === 'loading' && 'Searching…'}
            </p>
          </div>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="jobs-page__sort input"
            style={{ width: 'auto', height: '40px' }}
          >
            <option value="newest">Most Recent</option>
            <option value="salary_desc">Salary: High to Low</option>
            <option value="salary_asc">Salary: Low to High</option>
            <option value="relevant">Most Relevant</option>
          </select>
        </div>

        {/* Error */}
        {status === 'failed' && (
          <div className="jobs-main__error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error || 'Something went wrong. Please try again.'}</span>
            <button className="btn btn--outline btn--sm" onClick={() => dispatch(fetchJobs(filters))}>
              Retry
            </button>
          </div>
        )}

        {/* Grid: Loading */}
        {status === 'loading' && (
          <div className="jobs-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grid: Results */}
        {status === 'succeeded' && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && jobs.length === 0 && (
          <div className="jobs-empty">
            <div className="jobs-empty__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="jobs-empty__title text-h3 font-display">No jobs match your criteria</h3>
            <p className="jobs-empty__text text-body" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or clearing filters.</p>
            <button className="btn btn--primary" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
