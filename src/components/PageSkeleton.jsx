import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="container" style={{ padding: '60px 24px', minHeight: 'calc(100vh - 72px)' }}>
      <div className="skeleton" style={{ height: '48px', width: '30%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '24px', width: '50%', marginBottom: '48px' }} />
      
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-card)' }} />
      </div>
    </div>
  );
}
