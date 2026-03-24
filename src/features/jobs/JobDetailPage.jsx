import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow, format } from 'date-fns';
import {
  fetchJobById,
  selectSelectedJob,
  selectJobDetailStatus,
  selectJobsError,
  clearSelectedJob,
} from './jobsSlice';
import { fetchApplications } from '../applications/applicationsSlice';
import ApplyModal from './ApplyModal';
import { formatSalary, stringToHslColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import './JobDetailPage.css';



export default function JobDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(selectSelectedJob);
  const status = useSelector(selectJobDetailStatus);
  const error = useSelector(selectJobsError);
  const appStatus = useSelector((state) => state.applications.status);
  const applications = useSelector((state) => state.applications.items);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const hasApplied = applications.some(
    app => app.jobId === job?.id || app.job?.id === job?.id
  );

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Job saved to your profile.');
    } else {
      toast.success('Job removed from saved jobs.');
    }
  };

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => dispatch(clearSelectedJob());
  }, [dispatch, id]);

  useEffect(() => {
    if (appStatus === 'idle') dispatch(fetchApplications());
  }, [appStatus, dispatch]);

  // Loading skeleton
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="job-detail page-enter">
        <div className="job-detail__content">
          <div className="skeleton" style={{ width: 120, height: 14, borderRadius: 6, marginBottom: 24 }} />
          <div className="skeleton" style={{ width: '70%', height: 32, borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <div className="skeleton" style={{ width: 100, height: 28, borderRadius: 999 }} />
            <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 999 }} />
            <div className="skeleton" style={{ width: 90, height: 28, borderRadius: 999 }} />
          </div>
          <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 12 }} />
        </div>
        <aside className="job-detail__sidebar">
          <div className="skeleton" style={{ width: '100%', height: 240, borderRadius: 16 }} />
        </aside>
      </div>
    );
  }

  // Error
  if (status === 'failed') {
    return (
      <div className="job-detail__error-page page-enter">
        <div className="jobs-empty__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-h2">{error || 'Job not found'}</h2>
        <Link to="/jobs" className="btn btn--primary" style={{ marginTop: 16 }}>
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;

  const timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
  const postedDate = format(new Date(job.postedAt), 'MMM d, yyyy');

  return (
    <>
      <div className="job-detail page-enter">
        {/* ── Main Content ─────────────────────────────────────── */}
        <div className="job-detail__content">
          {/* Breadcrumb */}
          <nav className="job-detail__breadcrumb text-small">
            <Link to="/jobs">Jobs</Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span>{job.title}</span>
          </nav>

          {/* Header */}
          <header className="job-detail__header">
            <div className="job-detail__avatar" style={{ backgroundColor: stringToHslColor(job.company) }}>
              {job.company.charAt(0)}
            </div>
            <div className="job-detail__header-info">
              <h1 className="job-detail__title font-display">{job.title}</h1>
              <div className="job-detail__company-row">
                <span className="job-detail__company-name">{job.company}</span>
                <span className="job-detail__dot">·</span>
                <span className="job-detail__location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {job.location}
                </span>
                <span className="job-detail__dot">·</span>
                <span className="job-detail__posted">{timeAgo}</span>
              </div>
            </div>
          </header>

          {/* Badge Row */}
          <div className="job-detail__badges">
            <span className="job-detail__badge job-detail__badge--type">{job.type}</span>
            <span className="job-detail__badge job-detail__badge--experience">{job.experience} Level</span>
            <span className="job-detail__badge job-detail__badge--salary">
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)} / year
            </span>
          </div>

          {/* Tags */}
          <div className="job-detail__tags">
            {job.tags.map((tag) => (
              <span key={tag} className="job-detail__tag font-mono">{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div className="job-detail__tabs">
            {['overview', 'requirements', 'company'].map(tab => (
              <button
                key={tab}
                className={`job-detail__tab ${activeTab === tab ? 'job-detail__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <section className="job-detail__description">
              <h3>About the Role</h3>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </section>
          )}

          {activeTab === 'requirements' && (
            <section className="job-detail__description">
              <h3>Requirements</h3>
              <ul className="job-detail__requirements">
                <li>Experience level: {job.experience}</li>
                <li>Employment type: {job.type}</li>
                <li>Skills: {job.tags.join(', ')}</li>
              </ul>
            </section>
          )}

          {activeTab === 'company' && (
            <section className="job-detail__description">
              <h3>{job.company}</h3>
              <p>Location: {job.location}</p>
              <p>Job posted: {formatDistanceToNow(new Date(job.postedAt))} ago</p>
            </section>
          )}
        </div>

        {/* ── Sticky Sidebar ───────────────────────────────────── */}
        <aside className="job-detail__sidebar">
          <div className="job-detail__sidebar-card card">
            <h3 className="job-detail__sidebar-title">Apply to this role</h3>

            <div className="job-detail__sidebar-info">
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Company</span>
                <span className="job-detail__sidebar-value">{job.company}</span>
              </div>
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Location</span>
                <span className="job-detail__sidebar-value">{job.location}</span>
              </div>
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Job Type</span>
                <span className="job-detail__sidebar-value">{job.type}</span>
              </div>
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Experience</span>
                <span className="job-detail__sidebar-value">{job.experience}</span>
              </div>
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Salary</span>
                <span className="job-detail__sidebar-value job-detail__sidebar-value--salary">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </span>
              </div>
              <div className="job-detail__sidebar-row">
                <span className="job-detail__sidebar-label">Posted</span>
                <span className="job-detail__sidebar-value">{postedDate}</span>
              </div>
            </div>

            {hasApplied ? (
              <button className="btn btn--applied" disabled>
                ✓ Application Submitted
              </button>
            ) : (
              <button
                className="btn btn--primary btn--lg btn--full job-detail__apply-btn"
                onClick={() => setShowApplyModal(true)}
                id="apply-now-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                Apply Now
              </button>
            )}
            <button
              className={`btn btn--lg btn--full ${isSaved ? 'btn--secondary' : 'btn--outline'}`}
              style={{ marginTop: '12px', borderColor: isSaved ? 'var(--brand-primary)' : '', color: isSaved ? 'var(--brand-primary)' : '' }}
              onClick={handleToggleSave}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </aside>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
}
