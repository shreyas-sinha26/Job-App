import { Link } from 'react-router-dom';
import './LandingPage.css';

/**
 * Landing Page — public hero page.
 * Full implementation in Phase 5 (polish).
 * For now: functional scaffold with hero + CTAs.
 */
export default function LandingPage() {
  return (
    <div className="landing page-enter">
      {/* ── Top Nav (Landing-specific, minimal) ──────────── */}
      <header className="landing__nav">
        <div className="landing__nav-inner container">
          <div className="navbar__brand">
            <span className="navbar__brand-accent">Precision</span>Hire
          </div>
          <div className="landing__nav-actions">
            <Link to="/login" className="btn btn--ghost btn--sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn--primary btn--sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="landing__hero">
        <div className="landing__hero-inner container">
          <div className="landing__hero-text">
            <h1 className="text-hero">
              Find Work.{' '}
              <span className="landing__hero-accent">
                <em>Hire Talent.</em>
              </span>
              <br />
              No Noise.
            </h1>
            <p className="landing__hero-sub">
              The curated marketplace where high-intent professionals meet top-tier
              companies. No spam, no ghosting, just precision.
            </p>
            <div className="landing__hero-ctas">
              <Link to="/signup" className="btn btn--primary btn--lg">
                Get Hired
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/signup" className="btn btn--outline btn--lg">
                Post a Job
              </Link>
            </div>
          </div>

          {/* ── Decorative Cards (right side) ─────────────── */}
          <div className="landing__hero-visual">
            <div className="landing__float-card landing__float-card--1">
              <div className="landing__float-card-icon landing__float-card-icon--teal">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <div>
                <div className="text-xsmall" style={{ color: 'var(--brand-teal)', marginBottom: 4 }}>
                  ACTIVE
                </div>
                <h3 className="text-h3">Senior Product Designer</h3>
                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                  Loom · San Francisco, CA
                </p>
                <div className="landing__float-card-tags">
                  <span className="landing__tag">$160k – $210k</span>
                  <span className="landing__tag">Remote</span>
                </div>
              </div>
            </div>

            <div className="landing__float-card landing__float-card--2">
              <div className="landing__float-card-row">
                <div className="landing__float-card-avatar">A</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 14 }}>Alex Rivera</h4>
                  <p className="text-xsmall" style={{ color: 'var(--text-muted)' }}>
                    Staff Engineer @ Stripe
                  </p>
                </div>
              </div>
              <div className="landing__float-card-lines">
                <div className="landing__line landing__line--full"></div>
                <div className="landing__line landing__line--80"></div>
              </div>
            </div>

            <div className="landing__hero-glow"></div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────── */}
      <section className="landing__trust">
        <div className="container">
          <p className="landing__trust-label font-mono text-xsmall">
            Trusted by 12,000+ industry leaders
          </p>
          <div className="landing__trust-logos">
            <span className="landing__trust-logo">Stripe</span>
            <span className="landing__trust-logo">Airbnb</span>
            <span className="landing__trust-logo">Vercel</span>
            <span className="landing__trust-logo">Slack</span>
            <span className="landing__trust-logo">GitHub</span>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="landing__features">
        <div className="container">
          <div className="landing__features-grid">
            <div className="landing__feature-item">
              <div className="landing__feature-icon landing__feature-icon--blue">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-h3">Smart Matching</h3>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                Our proprietary AI filters out noise and highlights candidates who actually
                match your culture and tech stack.
              </p>
            </div>
            <div className="landing__feature-item">
              <div className="landing__feature-icon landing__feature-icon--teal">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3 className="text-h3">Verified Employers</h3>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                Every company is manually vetted to ensure legitimate listings, fair pay,
                and positive environments.
              </p>
            </div>
            <div className="landing__feature-item">
              <div className="landing__feature-icon landing__feature-icon--orange">
                <span className="material-symbols-outlined">update</span>
              </div>
              <h3 className="text-h3">Real-time Status</h3>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                No more black holes. Get instant updates when your application is viewed,
                shortlisted, or declined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="landing__steps">
        <div className="container">
          <div className="landing__steps-header">
            <h2 className="text-hero font-display">How it works</h2>
            <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
              Three simple steps to transition from searching to thriving in your next role.
            </p>
          </div>
          <div className="landing__steps-grid">
            <div className="landing__step-card">
              <div className="landing__step-number">1</div>
              <h4 className="text-h3">Create Profile</h4>
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                Upload your work history or sync with LinkedIn in one click.
                Our system highlights your unique strengths.
              </p>
            </div>
            <div className="landing__step-card">
              <div className="landing__step-number">2</div>
              <h4 className="text-h3">Browse & Apply</h4>
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                Use precision filters to find roles that match your salary, stack, and values.
              </p>
            </div>
            <div className="landing__step-card">
              <div className="landing__step-number landing__step-number--blue">3</div>
              <h4 className="text-h3">Get Hired</h4>
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                Communicate directly with hiring managers. Move through the pipeline
                with clarity and speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="landing__cta">
        <div className="container">
          <div className="landing__cta-grid">
            <div className="landing__cta-primary">
              <h2 className="text-hero font-display" style={{ color: 'var(--text-inverse)' }}>
                Ready to level up your career?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 420, marginBottom: 32 }}>
                Join 50,000+ professionals already using PrecisionHire to find their dream roles.
              </p>
              <Link to="/signup" className="btn btn--lg" style={{
                background: 'white', color: 'var(--brand-primary)', fontWeight: 700
              }}>
                Start Your Search
              </Link>
            </div>
            <div className="landing__cta-secondary">
              <h3 className="text-h2" style={{ color: 'var(--text-inverse)' }}>Hiring?</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>
                Get access to the top 2% of talent across Design, Engineering, and Product.
              </p>
              <Link to="/signup" style={{ color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Post a Job
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="landing__footer">
        <div className="landing__footer-inner container">
          <div className="landing__footer-brand">
            <div className="navbar__brand" style={{ color: 'white' }}>
              <span style={{ color: '#5EEAD4', fontStyle: 'italic' }}>Precision</span>Hire
            </div>
            <p className="text-small" style={{ color: 'var(--text-muted)', maxWidth: 300, marginTop: 8 }}>
              Editorial job hunting for the modern professional. Curated, precise, and human-centric.
            </p>
          </div>
          <div className="landing__footer-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="landing__footer-copy text-xsmall">
            © 2024 PrecisionHire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
