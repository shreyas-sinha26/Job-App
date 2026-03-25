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

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: '',
      experience: '',
      description: '',
      salaryMin: '',
      salaryMax: '',
      currency: 'INR',
      tags: '',
      deadline: ''
    }
  });

  const descriptionWatch = watch('description') || '';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchJobs({ employerId: user.id }));
    }
  }, [dispatch, user?.id]);

  /* ── Open create form ─────────────────────────────────────── */
  const openCreateForm = () => {
    setEditingJob(null);
    reset({
      title: '',
      company: user?.name || '',
      location: '',
      type: '',
      experience: '',
      description: '',
      salaryMin: '',
      salaryMax: '',
      currency: 'INR',
      tags: '',
      deadline: ''
    });
    setStep(1);
    setShowModal(true);
  };

  /* ── Open edit form ───────────────────────────────────────── */
  const openEditForm = (job) => {
    setEditingJob(job);
    reset({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      salaryMin: String(job.salaryMin),
      salaryMax: String(job.salaryMax),
      currency: job.currency || 'INR',
      tags: job.tags ? job.tags.join(', ') : '',
      deadline: job.deadline ? job.deadline.split('T')[0] : ''
    });
    setStep(1);
    setShowModal(true);
  };

  /* ── Close modal ──────────────────────────────────────────── */
  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setEditingJob(null);
    reset();
  };

  /* ── Submit handler ───────────────────────────────────────── */
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const jobData = {
        title: data.title.trim(),
        company: data.company.trim(),
        location: data.location.trim(),
        type: data.type,
        experience: data.experience,
        description: data.description.trim(),
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        currency: 'INR',
        tags: tagsArray,
        deadline: data.deadline || null
      };

      if (editingJob) {
        await dispatch(updateJob({ id: editingJob.id, ...jobData })).unwrap();
        toast.success('Job listing updated.');
      } else {
        await dispatch(createJob(jobData)).unwrap();
        toast.success('Job posted successfully!');
      }

      closeModal();

      // Refresh jobs list
      dispatch(fetchJobs({ employerId: user?.id }));

    } catch (err) {
      toast.error(err?.message || 'Failed to post job. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Delete handler ───────────────────────────────────────── */
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

  const handleAppCountClick = (jobId) => {
    navigate('/employer/applications', { state: { filterJobId: jobId } });
  };

  /* ── Derived data ─────────────────────────────────────────── */
  const displayedJobs = jobs.filter(j => !deletingIds.includes(j.id));
  const activeJobs = jobs.filter(j => j.status !== 'paused').length;
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = jobs.filter(j => new Date(j.postedAt) > oneWeekAgo).length;
  const applyRate = totalApplications && activeJobs
    ? (totalApplications / activeJobs).toFixed(1)
    : 0;

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

      {/* ══════════════════════════════════════════════════════════
           CREATE / EDIT MODAL
         ══════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-card">
            {/* Header */}
            <div className="modal-card__header">
              <h2 className="modal-card__title">
                {editingJob
                  ? 'Edit Job Posting'
                  : step === 1
                    ? 'Create New Job'
                    : 'Job Details'}
              </h2>
              <button
                className="modal-card__close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {/* Progress dots */}
            <div className="modal-steps">
              <div className={`modal-step-dot ${step >= 1 ? 'modal-step-dot--active' : ''}`} />
              <div className={`modal-step-dot ${step >= 2 ? 'modal-step-dot--active' : ''}`} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* ── STEP 1 FIELDS ── */}
              {step === 1 && (
                <div className="modal-card__body">

                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input
                      className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                      placeholder="e.g. Senior React Developer"
                      {...register('title', {
                        required: 'Job title is required',
                        minLength: {
                          value: 5,
                          message: 'Title must be at least 5 characters'
                        }
                      })}
                    />
                    {errors.title && (
                      <span className="form-error">{errors.title.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input
                      className={`form-input ${errors.company ? 'form-input--error' : ''}`}
                      placeholder="e.g. Razorpay"
                      {...register('company', {
                        required: 'Company name is required'
                      })}
                    />
                    {errors.company && (
                      <span className="form-error">{errors.company.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <input
                      className={`form-input ${errors.location ? 'form-input--error' : ''}`}
                      placeholder="e.g. Bangalore / Remote"
                      {...register('location', {
                        required: 'Location is required'
                      })}
                    />
                    {errors.location && (
                      <span className="form-error">{errors.location.message}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Job Type *</label>
                      <select
                        className={`form-input ${errors.type ? 'form-input--error' : ''}`}
                        {...register('type', {
                          required: 'Job type is required'
                        })}
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                      {errors.type && (
                        <span className="form-error">{errors.type.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Experience *</label>
                      <select
                        className={`form-input ${errors.experience ? 'form-input--error' : ''}`}
                        {...register('experience', {
                          required: 'Experience level is required'
                        })}
                      >
                        <option value="">Select level</option>
                        <option value="Entry">Entry</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead">Lead</option>
                      </select>
                      {errors.experience && (
                        <span className="form-error">{errors.experience.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Step 1 Footer */}
                  <div className="modal-card__footer">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={async () => {
                        const valid = await trigger([
                          'title', 'company', 'location',
                          'type', 'experience'
                        ]);
                        if (valid) setStep(2);
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2 FIELDS ── */}
              {step === 2 && (
                <div className="modal-card__body">

                  <div className="form-group">
                    <label className="form-label">Job Description *</label>
                    <textarea
                      className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
                      placeholder="Describe the role, responsibilities, and what you are looking for... (min 100 characters)"
                      rows={5}
                      {...register('description', {
                        required: 'Description is required',
                        minLength: {
                          value: 100,
                          message: 'Description must be at least 100 characters'
                        }
                      })}
                    />
                    <div className="form-char-count" style={{
                      color: descriptionWatch.length < 100 ? 'var(--danger)' : 'var(--text-muted)'
                    }}>
                      {descriptionWatch.length} / 100 min
                    </div>
                    {errors.description && (
                      <span className="form-error">{errors.description.message}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Min Salary (₹) *</label>
                      <input
                        type="number"
                        className={`form-input ${errors.salaryMin ? 'form-input--error' : ''}`}
                        placeholder="e.g. 1200000"
                        {...register('salaryMin', {
                          required: 'Min salary is required',
                          min: { value: 1, message: 'Must be greater than 0' },
                          validate: value =>
                            !watch('salaryMax') ||
                            Number(value) < Number(watch('salaryMax')) ||
                            'Must be less than max salary'
                        })}
                      />
                      {errors.salaryMin && (
                        <span className="form-error">{errors.salaryMin.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Max Salary (₹) *</label>
                      <input
                        type="number"
                        className={`form-input ${errors.salaryMax ? 'form-input--error' : ''}`}
                        placeholder="e.g. 1800000"
                        {...register('salaryMax', {
                          required: 'Max salary is required',
                          validate: value =>
                            !watch('salaryMin') ||
                            Number(value) > Number(watch('salaryMin')) ||
                            'Must be greater than min salary'
                        })}
                      />
                      {errors.salaryMax && (
                        <span className="form-error">{errors.salaryMax.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Skills / Tags *
                      <span className="form-label__hint">(comma separated)</span>
                    </label>
                    <input
                      className={`form-input ${errors.tags ? 'form-input--error' : ''}`}
                      placeholder="e.g. React, Node.js, MongoDB"
                      {...register('tags', {
                        required: 'At least one skill tag is required'
                      })}
                    />
                    {errors.tags && (
                      <span className="form-error">{errors.tags.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Application Deadline
                      <span className="form-label__hint">(optional)</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('deadline')}
                    />
                  </div>

                  {/* Step 2 Footer */}
                  <div className="modal-card__footer">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Publishing...'
                        : editingJob
                          ? 'Update Job'
                          : 'Save & Publish'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
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
