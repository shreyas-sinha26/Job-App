import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './ApplyModal.css';

export default function ApplyModal({ job, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields, isValid },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { coverLetter: '' },
  });

  const coverLetter = watch('coverLetter');

  const onSubmitForm = async (data) => {
    setSubmitting(true);
    try {
      await api.post(`/jobs/${job.id}/apply`, {
        coverLetter: data.coverLetter.trim(),
      });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      if (err.status === 409) {
        toast.error("You've already applied for this role.");
      } else {
        toast.error(err.message || 'Failed to submit application.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent background scroll & escape to close
  useEffect(() => {
    document.body.style.overflow = submitted ? '' : 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted]);

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  const getFieldState = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (dirtyFields[fieldName] && touchedFields[fieldName] && !errors[fieldName]) return 'valid';
    return 'neutral';
  };

  return (
    <div className="apply-overlay" onClick={handleClose}>
      <div
        className="apply-modal card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        tabIndex="-1"
      >
        {/* Close Button */}
        <button className="apply-modal__close" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {submitted ? (
          /* ── Success State ──────────────────────────────────── */
          <div className="apply-modal__success">
            <div className="apply-modal__success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="apply-modal__success-title text-h2">Application Submitted!</h2>
            <p className="apply-modal__success-text text-body">
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted.
              You'll be notified once the employer reviews it.
            </p>
            <button className="btn btn--primary btn--lg" onClick={handleClose}>
              Back to Job
            </button>
          </div>
        ) : (
          /* ── Form State ─────────────────────────────────────── */
          <>
            <div className="apply-modal__header">
              <h2 id="apply-modal-title" className="apply-modal__title text-h2">
                Apply for this Role
              </h2>
              <p className="apply-modal__subtitle text-body">
                <strong>{job.title}</strong> at {job.company}
              </p>
            </div>

            <form className="apply-modal__form" onSubmit={handleSubmit(onSubmitForm)} noValidate>
              <div className="apply-modal__field">
                <label htmlFor="cover-letter" className="apply-modal__label">
                  Cover Letter
                </label>
                <p className="apply-modal__hint text-small">
                  Introduce yourself and explain why you're a great fit for this role.
                </p>
                <textarea
                  id="cover-letter"
                  className={`textarea ${getFieldState('coverLetter') === 'error' ? 'input--error' : ''} ${getFieldState('coverLetter') === 'valid' ? 'input--success' : ''}`}
                  placeholder="Dear hiring team at {{company}},&#10;&#10;I'm excited to apply for the {{role}} position…"
                  rows={8}
                  maxLength={1000}
                  autoFocus
                  {...register('coverLetter', {
                    required: 'Cover letter is required',
                    minLength: {
                      value: 100,
                      message: 'Cover letter must be at least 100 characters',
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Cover letter cannot exceed 1000 characters',
                    },
                  })}
                />
                <div 
                  className="apply-modal__char-count text-xsmall"
                  style={{ color: coverLetter.length > 1000 || (touchedFields.coverLetter && coverLetter.length < 100) ? 'var(--danger)' : 'var(--text-muted)' }}
                >
                  {coverLetter.length}/1000
                </div>
                {errors.coverLetter && (
                  <div className="auth-field__error" aria-live="polite">{errors.coverLetter.message}</div>
                )}
              </div>

              <div className="apply-modal__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={submitting || !isValid}
                  id="submit-application-btn"
                >
                  {submitting ? (
                    <>
                      <span className="apply-modal__spinner" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
