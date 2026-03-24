import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import {
  fetchApplications,
  selectAllApplications,
  selectApplicationsStatus,
  selectApplicationsError,
} from './applicationsSlice';
import { stringToHslColor } from '../../utils/formatters';
import './ApplicationsPage.css';

function getStatusClass(status) {
  switch (status) {
    case 'Pending':  return 'app-status--pending';
    case 'Reviewed': return 'app-status--reviewed';
    case 'Accepted': return 'app-status--accepted';
    case 'Rejected': return 'app-status--rejected';
    default:         return '';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Pending':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'Reviewed':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'Accepted':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 'Rejected':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
    default:
      return null;
  }
}

export default function ApplicationsPage() {
  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);
  
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'Pending').length,
    reviewed: applications.filter((a) => a.status === 'Reviewed').length,
    accepted: applications.filter((a) => a.status === 'Accepted').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="applications-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="applications-page__header">
          <h1 className="text-h1 font-display">My Applications</h1>
          <p className="applications-page__subtitle text-body">
            Track the status of your job applications
          </p>
        </div>

        {/* Stats */}
        <div className="applications-page__stats">
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value">{stats.total}</span>
            <span className="applications-page__stat-label">Total</span>
          </div>
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value" style={{ color: 'var(--pending)' }}>{stats.pending}</span>
            <span className="applications-page__stat-label">Pending</span>
          </div>
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value" style={{ color: 'var(--brand-primary)' }}>{stats.reviewed}</span>
            <span className="applications-page__stat-label">Reviewed</span>
          </div>
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value" style={{ color: 'var(--success)' }}>{stats.accepted}</span>
            <span className="applications-page__stat-label">Accepted</span>
          </div>
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value" style={{ color: 'var(--danger)' }}>{stats.rejected}</span>
            <span className="applications-page__stat-label">Rejected</span>
          </div>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="applications-page__loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 8 }} />
            ))}
          </div>
        )}

        {/* Error */}
        {status === 'failed' && (
          <div className="jobs-main__error" style={{ marginBottom: 24 }}>
            <span>{error || 'Failed to load applications.'}</span>
            <button className="btn btn--outline btn--sm" onClick={() => dispatch(fetchApplications())}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {status === 'succeeded' && applications.length > 0 && (
          <div className="applications-table">
            <div className="applications-table__head">
              <span className="applications-table__col applications-table__col--job">Position</span>
              <span className="applications-table__col applications-table__col--status">Status</span>
              <span className="applications-table__col applications-table__col--date">Applied</span>
              <span className="applications-table__col applications-table__col--action">Details</span>
            </div>
            {applications.map((app) => (
              <div key={app.id} className="applications-table__row-wrapper">
                <div 
                  className="applications-table__row" 
                  id={`application-${app.id}`}
                  onClick={() => toggleExpand(app.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="applications-table__col applications-table__col--job">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div 
                        className="job-detail__avatar" 
                        style={{ width: 40, height: 40, fontSize: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0, backgroundColor: stringToHslColor(app.company) }}>
                        {app.company.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="applications-table__job-title">{app.jobTitle}</span>
                        <span className="applications-table__company text-small">{app.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="applications-table__col applications-table__col--status">
                    <span className={`app-status ${getStatusClass(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </div>
                  <span className="applications-table__col applications-table__col--date text-small">
                    {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                  </span>
                  <span className="applications-table__col applications-table__col--action" style={{ textAlign: 'right' }}>
                    <button className="btn btn--ghost btn--sm btn--icon-only" aria-label="Toggle Cover Letter">
                      {expandedId === app.id ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      )}
                    </button>
                  </span>
                </div>
                {expandedId === app.id && (
                  <div className="applications-table__expanded-content">
                    <h4 className="text-small font-mono" style={{ marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Letter</h4>
                    <p className="text-body" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                      {app.coverLetter || 'No cover letter provided.'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {status === 'succeeded' && applications.length === 0 && (
          <div className="applications-page__empty">
            <div className="jobs-empty__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h3 className="text-h3">No applications yet</h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              Browse open roles and submit your first application.
            </p>
            <a href="/jobs" className="btn btn--primary">
              Browse Jobs
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
