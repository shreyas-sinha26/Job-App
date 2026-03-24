import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchEmployerApplications,
  updateApplicationStatus,
  selectAllApplications,
  selectApplicationsStatus,
  selectApplicationsError,
} from './applicationsSlice';
import './EmployerApplicationsPage.css';

const STATUS_OPTIONS = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

function getStatusClass(status) {
  switch (status) {
    case 'Pending':  return 'app-status--pending';
    case 'Reviewed': return 'app-status--reviewed';
    case 'Accepted': return 'app-status--accepted';
    case 'Rejected': return 'app-status--rejected';
    default:         return '';
  }
}

export default function EmployerApplicationsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const applications = useSelector(selectAllApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJobId, setFilterJobId] = useState(location.state?.filterJobId || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Reset expansion when selecting a different app
  useEffect(() => {
    setIsExpanded(false);
  }, [selectedApp]);

  useEffect(() => {
    dispatch(fetchEmployerApplications());
  }, [dispatch]);

  const uniqueJobs = Array.from(new Set(applications.map(a => a.jobId))).map(id => applications.find(a => a.jobId === id));

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus({ id: appId, status: newStatus })).unwrap();
      toast.success('Application status updated.');
    } catch (err) {
      toast.error(err || 'Failed to update status.');
    }
  };

  const jobFilteredApps = filterJobId
    ? applications.filter(a => a.jobId === filterJobId)
    : applications;

  const filteredApps = filterStatus
    ? jobFilteredApps.filter((a) => a.status === filterStatus)
    : jobFilteredApps;

  // Stats
  const stats = {
    total: jobFilteredApps.length,
    pending: jobFilteredApps.filter((a) => a.status === 'Pending').length,
    accepted: jobFilteredApps.filter((a) => a.status === 'Accepted').length,
    rejected: jobFilteredApps.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="emp-apps page-enter">
      <div className="container">
        {/* Header */}
        <div className="emp-apps__header">
          <div>
            <h1 className="text-h1 font-display">Applicant Review</h1>
            <p className="emp-apps__subtitle text-body">
              {filterJobId 
                ? `Reviewing applications for specific job. Clear filter to see all.` 
                : `Review and manage applications for your job postings`}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="emp-apps__stats">
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value">{stats.total}</span>
            <span className="applications-page__stat-label">Total</span>
          </div>
          <div className="applications-page__stat card">
            <span className="applications-page__stat-value" style={{ color: 'var(--pending)' }}>{stats.pending}</span>
            <span className="applications-page__stat-label">Pending</span>
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

        {/* Filter Bar */}
        <div className="emp-apps__filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="emp-apps__filter-label text-small">Job:</span>
            <select 
              className="input" 
              style={{ width: 'auto', minWidth: '200px', height: '36px' }}
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
            >
              <option value="">All Jobs</option>
              {uniqueJobs.map(app => (
                <option key={app.jobId} value={app.jobId}>{app.jobTitle}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="emp-apps__filter-label text-small">Status:</span>
            <div className="emp-apps__filter-chips">
            <button
              className={`jobs-sidebar__chip ${!filterStatus ? 'jobs-sidebar__chip--active' : ''}`}
              onClick={() => setFilterStatus('')}
            >
              All
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                className={`jobs-sidebar__chip ${filterStatus === s ? 'jobs-sidebar__chip--active' : ''}`}
                onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ padding: '16px 0' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12, marginBottom: 8 }} />
            ))}
          </div>
        )}

        {/* Error */}
        {status === 'failed' && (
          <div className="jobs-main__error" style={{ marginBottom: 24 }}>
            <span>{error || 'Failed to load applications.'}</span>
            <button className="btn btn--outline btn--sm" onClick={() => dispatch(fetchEmployerApplications())}>
              Retry
            </button>
          </div>
        )}

        {/* Split Layout */}
        {status === 'succeeded' && (
          <div className="emp-apps__split">
            {/* List */}
            <div className="emp-apps__list">
              {filteredApps.length === 0 ? (
                <div className="emp-apps__empty-list">
                  <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                    {jobFilteredApps.length === 0
                      ? 'No applications received yet.'
                      : 'No applications match this filter.'
                    }
                  </p>
                  {jobFilteredApps.length === 0 && (
                    <Link to="/employer/manage" className="btn btn--primary" style={{ marginTop: 16 }}>Go to Manage Jobs</Link>
                  )}
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className={`emp-apps__list-item card ${selectedApp?.id === app.id ? 'emp-apps__list-item--active' : ''}`}
                    onClick={() => setSelectedApp(app)}
                    id={`emp-app-${app.id}`}
                  >
                    <div className="emp-apps__list-item-top">
                      <div className="emp-apps__list-item-info">
                        <span className="emp-apps__applicant-name">{app.applicant ? app.applicant.name : 'Unknown Applicant'}</span>
                        <span className="emp-apps__job-ref text-small">{app.jobTitle}</span>
                      </div>
                      <span className={`app-status ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <span className="emp-apps__list-date text-xsmall">
                      {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Detail Panel */}
            <div className="emp-apps__detail">
              {selectedApp ? (
                <div className="emp-apps__detail-card card">
                  <div className="emp-apps__detail-header">
                    <h3 className="text-h3">Application Details</h3>
                    <span className={`app-status ${getStatusClass(selectedApp.status)}`}>
                      {selectedApp.status}
                    </span>
                  </div>

                  <div className="emp-apps__detail-meta">
                    <div className="emp-apps__detail-row">
                      <span className="emp-apps__detail-label">Applicant</span>
                      <span className="emp-apps__detail-value">{selectedApp.applicant ? selectedApp.applicant.name : 'Unknown'}</span>
                    </div>
                    <div className="emp-apps__detail-row">
                      <span className="emp-apps__detail-label">Email</span>
                      <span className="emp-apps__detail-value">{selectedApp.applicant ? selectedApp.applicant.email : 'Unknown'}</span>
                    </div>
                    <div className="emp-apps__detail-row">
                      <span className="emp-apps__detail-label">Position</span>
                      <span className="emp-apps__detail-value">{selectedApp.jobTitle}</span>
                    </div>
                    <div className="emp-apps__detail-row">
                      <span className="emp-apps__detail-label">Company</span>
                      <span className="emp-apps__detail-value">{selectedApp.company}</span>
                    </div>
                    <div className="emp-apps__detail-row">
                      <span className="emp-apps__detail-label">Applied On</span>
                      <span className="emp-apps__detail-value">
                        {format(new Date(selectedApp.appliedAt), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="emp-apps__detail-letter">
                    <h4 className="emp-apps__detail-section-title">Cover Letter</h4>
                    <p className="emp-apps__detail-letter-text text-body">
                      {(selectedApp.coverLetter && selectedApp.coverLetter.length > 200 && !isExpanded) 
                        ? `${selectedApp.coverLetter.substring(0, 200)}...`
                        : (selectedApp.coverLetter || 'No cover letter provided.')}
                    </p>
                    {selectedApp.coverLetter && selectedApp.coverLetter.length > 200 && (
                      <button 
                        className="btn btn--ghost btn--sm" 
                        style={{ marginTop: '8px', padding: '0' }}
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>

                  <div className="emp-apps__detail-actions">
                    <h4 className="emp-apps__detail-section-title">Update Status</h4>
                    <div className="emp-apps__status-buttons">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          className={`btn btn--sm ${
                            selectedApp.status === s
                              ? 'btn--primary'
                              : 'btn--outline'
                          }`}
                          onClick={() => handleStatusChange(selectedApp.id, s)}
                          disabled={selectedApp.status === s}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="emp-apps__detail-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <p className="text-body" style={{ color: 'var(--text-muted)' }}>
                    Select an application to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
