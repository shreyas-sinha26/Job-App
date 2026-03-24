import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
  selectAllJobs,
  selectJobsStatus,
  selectJobCreateStatus,
} from './jobsSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { formatSalary } from '../../utils/formatters';
import './ManageJobsPage.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
const EXP_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];

export default function ManageJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const jobs = useSelector(selectAllJobs);
  const status = useSelector(selectJobsStatus);
  const createStatus = useSelector(selectJobCreateStatus);

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields, dirtyFields }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      experience: 'Mid',
      salaryMin: '',
      salaryMax: '',
      tags: '',
      description: '',
    }
  });

  const salaryMinWatch = watch('salaryMin');
  const descriptionWatch = watch('description') || '';
  const tagsWatch = watch('tags') || '';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchJobs({ employerId: user.id }));
    }
  }, [dispatch, user?.id]);

  const openCreateForm = () => {
    setEditingJob(null);
    reset({
      title: '',
      company: user?.name || '',
      location: '',
      type: 'Full-time',
      experience: 'Mid',
      salaryMin: '',
      salaryMax: '',
      tags: '',
      description: '',
    });
    setStep(1);
    setShowForm(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    reset({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salaryMin: String(job.salaryMin),
      salaryMax: String(job.salaryMax),
      tags: job.tags ? job.tags.join(', ') : '',
      description: job.description,
    });
    setStep(1);
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    const jobData = {
      ...data,
      salaryMin: Number(data.salaryMin),
      salaryMax: Number(data.salaryMax),
      currency: 'INR',
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      employerId: user?.id || 'emp-mock',
    };

    try {
      if (editingJob) {
        await dispatch(updateJob({ id: editingJob.id, ...jobData })).unwrap();
        toast.success('Job listing updated.');
      } else {
        await dispatch(createJob(jobData)).unwrap();
        toast.success('Job posted successfully!');
      }
      setShowForm(false);
      setEditingJob(null);
    } catch (err) {
      toast.error('Network error. Something went wrong.');
    }
  };

  const handleDelete = useCallback(async (id) => {
    setDeletingIds(prev => [...prev, id]);
    setDeleteConfirm(null);
    try {
      await dispatch(deleteJob(id)).unwrap();
      toast.success('Job listing removed.');
    } catch (err) {
      setDeletingIds(prev => prev.filter(delId => delId !== id));
      toast.error('Failed to delete. Please try again.');
    }
  }, [dispatch]);

  const displayedJobs = jobs.filter(j => !deletingIds.includes(j.id));
  
  const activeJobs = jobs.filter(j => j.status !== 'paused').length;
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = jobs.filter(j => new Date(j.postedAt) > oneWeekAgo).length;
  const applyRate = totalApplications > 0 ? ((totalApplications / (activeJobs || 1)) / 100 * 100).toFixed(1) : 0; // The instruction says (total / (activeJobs * 100)) * 100 which cancels out 100. So (total / activeJobs). Wait, the formula was exactly given as `((totalApplications / (activeJobs * 100)) * 100).toFixed(1)`. Let's just do `(totalApplications && activeJobs ? ((totalApplications / activeJobs) * 100).toFixed(1) : 0)`. Wait, I will use `((totalApplications / ((activeJobs||1) * 100)) * 100).toFixed(1)` to mirror what was requested without div by 0. Wait, `(total/(activeJobs*100))*100` means `total / activeJobs`. No, applyRate should be `total / activeJobs`? Wait if there's 5 apps for 1 job, apply rate is 500%?! No, if it's applications divided by views * 100. We don't have views. The prompt says exactly this copy. Ok!



  const getFieldState = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (dirtyFields[fieldName] && touchedFields[fieldName]) return 'valid';
    return 'neutral';
  };

  const handleAppCountClick = (jobId) => {
      navigate('/employer/applications', { state: { filterJobId: jobId } });
  };

  return (
    <div className="manage-jobs page-enter">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="manage-jobs__header container">
        <div>
          <h1 className="text-h1 font-display">Manage Jobs</h1>
          <p className="manage-jobs__subtitle text-body">
            Create, edit, and manage your job postings
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={openCreateForm}
          id="post-new-job-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Post New Job
        </button>
      </div>

      {/* ── Stats Strip ───────────────────────────────────────── */}
      <div className="manage-jobs__stats container">
        <div className="manage-jobs__stat card">
          <span className="manage-jobs__stat-value">{activeJobs}</span>
          <span className="manage-jobs__stat-label">Active Jobs</span>
        </div>
        <div className="manage-jobs__stat card">
          <span className="manage-jobs__stat-value manage-jobs__stat-value--active">
            {totalApplications}
          </span>
          <span className="manage-jobs__stat-label">Total Applications</span>
        </div>
        <div className="manage-jobs__stat card">
          <span className="manage-jobs__stat-value manage-jobs__stat-value--draft">
            {newThisWeek}
          </span>
          <span className="manage-jobs__stat-label">New This Week</span>
        </div>
        <div className="manage-jobs__stat card">
          <span className="manage-jobs__stat-value">{applyRate}%</span>
          <span className="manage-jobs__stat-label">Apply Rate</span>
        </div>
      </div>

      {/* ── Job Table ─────────────────────────────────────────── */}
      <div className="manage-jobs__table-wrap container">
        {status === 'loading' ? (
          <div className="manage-jobs__loading">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12, marginBottom: 8 }} />
            ))}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="manage-jobs__empty">
            <div className="jobs-empty__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 className="text-h3 font-display" style={{ fontStyle: 'italic', marginBottom: '8px' }}>You haven't posted any jobs yet.</h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Create your first job posting to start receiving applications.
            </p>
            <button className="btn btn--primary" onClick={openCreateForm}>
              Post Your First Job →
            </button>
          </div>
        ) : (
          <div className="manage-jobs__table">
            <div className="manage-jobs__table-head hidden-mobile">
              <span className="manage-jobs__col manage-jobs__col--title">Job Title</span>
              <span className="manage-jobs__col manage-jobs__col--type">Type</span>
              <span className="manage-jobs__col manage-jobs__col--location">Location</span>
              <span className="manage-jobs__col manage-jobs__col--salary">Salary</span>
              <span className="manage-jobs__col manage-jobs__col--posted">Posted</span>
              <span className="manage-jobs__col manage-jobs__col--apps">Apps</span>
              <span className="manage-jobs__col manage-jobs__col--actions">Actions</span>
            </div>
            {displayedJobs.map((job) => (
              <div key={job.id} className="manage-jobs__table-row" id={`manage-job-${job.id}`}>
                <div className="manage-jobs__col manage-jobs__col--title">
                  <span className="manage-jobs__job-title">{job.title}</span>
                  <span className="manage-jobs__job-company text-small">{job.company}</span>
                </div>
                <span className="manage-jobs__col manage-jobs__col--type hidden-mobile">
                  <span className={`manage-jobs__type-badge manage-jobs__type-badge--${job.type.toLowerCase().replace(/\s|-/g, '')}`}>
                    {job.type}
                  </span>
                </span>
                <span className="manage-jobs__col manage-jobs__col--location hidden-mobile">{job.location}</span>
                <span className="manage-jobs__col manage-jobs__col--salary hidden-mobile">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency || 'INR')}
                </span>
                <span className="manage-jobs__col manage-jobs__col--posted text-small hidden-mobile">
                  {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                </span>
                <span className="manage-jobs__col manage-jobs__col--apps">
                  <button 
                    className="manage-jobs__app-count btn--ghost" 
                    onClick={() => handleAppCountClick(job.id)}
                    title="View related applications"
                  >
                    {job.applicationsCount || 0}
                  </button>
                </span>
                <div className="manage-jobs__col manage-jobs__col--actions">
                  <label className="status-toggle" style={{ marginRight: '8px' }}>
                    <input
                      type="checkbox"
                      checked={job.status !== 'paused'}
                      onChange={() => dispatch(updateJob({ 
                        id: job.id, 
                        status: job.status === 'paused' ? 'active' : 'paused' 
                      }))}
                    />
                    <span className="status-toggle__pill">
                      {job.status === 'paused' ? 'Paused' : 'Active'}
                    </span>
                  </label>
                  <button
                    className="btn btn--ghost btn--sm btn--icon-only"
                    onClick={() => openEditForm(job)}
                    title="Edit"
                    aria-label={`Edit ${job.title}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className="btn btn--ghost btn--sm btn--icon-only manage-jobs__delete-btn"
                    onClick={() => setDeleteConfirm(job.id)}
                    title="Delete"
                    aria-label={`Delete ${job.title}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ─────────────────────────────────── */}
      {showForm && (
        <div className="apply-overlay" onClick={() => setShowForm(false)}>
          <div
            className="manage-jobs__form-modal card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="apply-modal__close"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <h2 className="text-h2" style={{ marginBottom: 24 }}>
              {editingJob ? 'Edit Job Posting' : 'Create New Job'}
            </h2>
            
            <div className="modal__steps">
              {[1, 2].map(n => (
                <div 
                  key={n}
                  className={`modal__step-dot ${step >= n ? 'modal__step-dot--active' : ''}`}
                />
              ))}
            </div>

            <form className="manage-jobs__form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="manage-jobs__form-grid">
                {step === 1 && (
                  <>
                    {/* Title */}
                    <div className="manage-jobs__form-field manage-jobs__form-field--full">
                      <label>Job Title *</label>
                  <input
                    className={`input ${getFieldState('title') === 'error' ? 'input--error' : ''} ${getFieldState('title') === 'valid' ? 'input--success' : ''}`}
                    placeholder="e.g., Senior Frontend Engineer"
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 5, message: 'Must be at least 5 characters' }
                    })}
                  />
                  {errors.title && <span className="auth-field__error" aria-live="polite">{errors.title.message}</span>}
                </div>

                {/* Company */}
                <div className="manage-jobs__form-field">
                  <label>Company *</label>
                  <input
                    className={`input ${getFieldState('company') === 'error' ? 'input--error' : ''} ${getFieldState('company') === 'valid' ? 'input--success' : ''}`}
                    placeholder="Company name"
                    {...register('company', { required: 'Company is required' })}
                  />
                  {errors.company && <span className="auth-field__error" aria-live="polite">{errors.company.message}</span>}
                </div>

                {/* Location */}
                <div className="manage-jobs__form-field">
                  <label>Location *</label>
                  <input
                     className={`input ${getFieldState('location') === 'error' ? 'input--error' : ''} ${getFieldState('location') === 'valid' ? 'input--success' : ''}`}
                    placeholder="e.g., Bangalore"
                    {...register('location', { required: 'Location is required' })}
                  />
                  {errors.location && <span className="auth-field__error" aria-live="polite">{errors.location.message}</span>}
                </div>

                {/* Type */}
                <div className="manage-jobs__form-field">
                  <label>Job Type *</label>
                  <select className="input" {...register('type', { required: 'Required' })}>
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                    {/* Experience */}
                    <div className="manage-jobs__form-field">
                      <label>Experience *</label>
                      <select className="input" {...register('experience', { required: 'Required' })}>
                        {EXP_LEVELS.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Salary Min */}
                <div className="manage-jobs__form-field">
                  <label>Min Salary (₹) *</label>
                  <input
                    type="number"
                     className={`input ${getFieldState('salaryMin') === 'error' ? 'input--error' : ''} ${getFieldState('salaryMin') === 'valid' ? 'input--success' : ''}`}
                    placeholder="e.g., 1400000"
                    {...register('salaryMin', {
                      required: 'Required',
                      min: { value: 1, message: 'Must be greater than 0' }
                    })}
                  />
                  {errors.salaryMin && <span className="auth-field__error" aria-live="polite">{errors.salaryMin.message}</span>}
                </div>

                {/* Salary Max */}
                <div className="manage-jobs__form-field">
                  <label>Max Salary (₹) *</label>
                  <input
                    type="number"
                    className={`input ${getFieldState('salaryMax') === 'error' ? 'input--error' : ''} ${getFieldState('salaryMax') === 'valid' ? 'input--success' : ''}`}
                    placeholder="e.g., 2000000"
                    {...register('salaryMax', {
                      required: 'Required',
                      validate: value => !salaryMinWatch || Number(value) > Number(salaryMinWatch) || 'Max salary must be greater than min salary'
                    })}
                  />
                  {errors.salaryMax && <span className="auth-field__error" aria-live="polite">{errors.salaryMax.message}</span>}
                </div>

                {/* Tags */}
                <div className="manage-jobs__form-field manage-jobs__form-field--full">
                  <label>Tags (comma separated) *</label>
                  <input
                    className={`input ${getFieldState('tags') === 'error' ? 'input--error' : ''} ${getFieldState('tags') === 'valid' ? 'input--success' : ''}`}
                    placeholder="React, Node.js, TypeScript"
                    {...register('tags', {
                      required: 'At least 1 tag is required',
                      validate: value => value.split(',').filter(t => t.trim()).length > 0 || 'At least 1 tag is required'
                    })}
                  />
                  {errors.tags && <span className="auth-field__error" aria-live="polite">{errors.tags.message}</span>}
                </div>

                    {/* Description */}
                    <div className="manage-jobs__form-field manage-jobs__form-field--full">
                      <label>Description (HTML supported) *</label>
                      <textarea
                        className={`textarea ${getFieldState('description') === 'error' ? 'input--error' : ''} ${getFieldState('description') === 'valid' ? 'input--success' : ''}`}
                        placeholder="Describe the role, responsibilities, and requirements…"
                        rows={6}
                        {...register('description', {
                          required: 'Description is required',
                          minLength: { value: 100, message: 'Must be at least 100 characters' }
                        })}
                      />
                      <div className="apply-modal__char-count text-xsmall" style={{ color: descriptionWatch.length < 100 && touchedFields.description ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {descriptionWatch.length} / 100 min
                      </div>
                      {errors.description && <span className="auth-field__error" aria-live="polite">{errors.description.message}</span>}
                    </div>
                  </>
                )}
              </div>

              <div className="manage-jobs__form-actions">
                {step === 1 ? (
                  <>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn--primary btn--lg"
                      onClick={() => {
                        trigger(['title','company','location','type','experience']).then(valid => {
                          if (valid) setStep(2);
                        });
                      }}
                    >
                      Next →
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary btn--lg"
                      disabled={createStatus === 'loading' || !isValid}
                    >
                      {createStatus === 'loading' ? 'Saving…' : editingJob ? 'Update Job' : 'Save & Publish'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="apply-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="manage-jobs__confirm card"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="manage-jobs__confirm-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-h3">Delete this job?</h3>
            <p className="text-body" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              This action cannot be undone. All associated applications will be affected.
            </p>
            <div className="manage-jobs__confirm-actions">
              <button className="btn btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
