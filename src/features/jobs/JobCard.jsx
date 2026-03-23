import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { formatSalary, stringToHslColor } from '../../utils/formatters';
import './JobCard.css';

/**
 * Get badge variant for job type
 */
function getTypeBadgeClass(type) {
  switch (type) {
    case 'Remote': return 'job-card__type--remote';
    case 'Full-time': return 'job-card__type--fulltime';
    case 'Part-time': return 'job-card__type--parttime';
    case 'Contract': return 'job-card__type--contract';
    case 'Internship': return 'job-card__type--internship';
    default: return '';
  }
}

const JobCard = memo(function JobCard({ job, index = 0 }) {
  const {
    id, title, company, location, type,
    experience, salaryMin, salaryMax, currency,
    tags, postedAt,
  } = job;

  const timeAgo = formatDistanceToNow(new Date(postedAt), { addSuffix: true });
  const salary = formatSalary(salaryMin, salaryMax, currency);
  const avatarBg = stringToHslColor(company);

  return (
    <Link 
      to={`/jobs/${id}`} 
      className="job-card card card--hoverable job-card-animate" 
      id={`job-card-${id}`}
      style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}
    >
      {/* Header: Logo + Company + Time */}
      <div className="job-card__header">
        <div className="job-card__avatar" style={{ backgroundColor: avatarBg }}>
          {company.charAt(0)}
        </div>
        <div className="job-card__meta">
          <span className="job-card__company">{company}</span>
          <span className="job-card__time text-xsmall">{timeAgo}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="job-card__title">{title}</h3>

      {/* Info Row */}
      <div className="job-card__info">
        <span className="job-card__info-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {location}
        </span>
        <span className={`job-card__type ${getTypeBadgeClass(type)}`}>
          {type}
        </span>
        <span className="job-card__experience">{experience}</span>
      </div>

      {/* Salary */}
      <div className="job-card__salary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>{salary} / year</span>
      </div>

      {/* Tags */}
      <div className="job-card__tags">
        {tags.slice(0, 4).map((tag) => (
          <span key={tag} className="job-card__tag font-mono">{tag}</span>
        ))}
        {tags.length > 4 && (
          <span className="job-card__tag job-card__tag--more font-mono">+{tags.length - 4}</span>
        )}
      </div>
    </Link>
  );
});

export default JobCard;

/**
 * JobCardSkeleton — shimmer loading placeholder
 */
export function JobCardSkeleton() {
  return (
    <div className="job-card card job-card--skeleton" aria-hidden="true">
      <div className="job-card__header">
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
        <div className="job-card__meta">
          <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 60, height: 11, borderRadius: 4, marginTop: 4 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '80%', height: 20, borderRadius: 6, marginTop: 16 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: 64, height: 24, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: 56, height: 24, borderRadius: 999 }} />
      </div>
      <div className="skeleton" style={{ width: '50%', height: 16, borderRadius: 6, marginTop: 12 }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
        <div className="skeleton" style={{ width: 64, height: 24, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 72, height: 24, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 56, height: 24, borderRadius: 6 }} />
      </div>
    </div>
  );
}
