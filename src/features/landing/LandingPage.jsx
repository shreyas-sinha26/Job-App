import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

// ── Animated counter component ──────────────────────────────
function AnimCounter({ end, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: end,
      duration,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate() { el.textContent = Math.floor(el.innerText).toLocaleString() + suffix; },
    });
  }, [end, suffix, duration]);
  return <span ref={ref}>0{suffix}</span>;
}

// ── Particle canvas background ──────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];
    const particleCount = 60;

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = Math.random() > 0.5 ? '29, 78, 216' : '13, 148, 136';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.offsetWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.offsetHeight) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(29, 78, 216, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animFrame = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="landing__particles" />;
}

// ── Magnetic button component ───────────────────────────────
function MagneticButton({ children, className, ...props }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <span ref={btnRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ display: 'inline-block' }}>
      {props.to ? (
        <Link className={className} to={props.to}>{children}</Link>
      ) : (
        <button className={className} {...props}>{children}</button>
      )}
    </span>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const floatCard1Ref = useRef(null);
  const floatCard2Ref = useRef(null);
  const floatCard3Ref = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const trustRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Nav scroll effect ──────────────────────────────
      const handleScroll = () => setNavScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);

      // ── Hero timeline ──────────────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.landing__hero-badge', { y: 30, opacity: 0, duration: 0.6 })
        .from('.landing__hero-title .line', { y: 80, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
        .from('.landing__hero-sub', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.landing__hero-ctas > *', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
        .from('.landing__hero-metric', { y: 40, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

      // ── Floating cards entrance + continuous float ─────
      if (floatCard1Ref.current) {
        heroTl.from(floatCard1Ref.current, { x: 100, y: 60, opacity: 0, rotation: 10, duration: 1, ease: 'power2.out' }, '-=0.8');
        gsap.to(floatCard1Ref.current, { y: '+=15', rotation: '+=1', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
      if (floatCard2Ref.current) {
        heroTl.from(floatCard2Ref.current, { x: -60, y: 80, opacity: 0, rotation: -8, duration: 1, ease: 'power2.out' }, '-=0.7');
        gsap.to(floatCard2Ref.current, { y: '-=12', rotation: '-=1.5', duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      }
      if (floatCard3Ref.current) {
        heroTl.from(floatCard3Ref.current, { x: 40, y: -40, opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.6');
        gsap.to(floatCard3Ref.current, { y: '+=10', rotation: '+=2', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      }

      // ── Glow pulse ─────────────────────────────────────
      gsap.to('.landing__hero-glow', { scale: 1.2, opacity: 0.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.landing__hero-glow--2', { scale: 1.3, opacity: 0.4, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

      // ── Trust strip logos staggered slide-in ───────────
      gsap.from('.landing__trust-logo', {
        y: 30, opacity: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: trustRef.current, start: 'top 85%' },
      });

      // ── Stats counter section ──────────────────────────
      gsap.from('.landing__stat-card', {
        y: 60, opacity: 0, duration: 0.6, stagger: 0.15,
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
      });

      // ── Features scroll reveal ─────────────────────────
      gsap.from('.landing__feature-item', {
        y: 80, opacity: 0, duration: 0.7, stagger: 0.2,
        scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' },
      });

      // ── Feature icons continuous bounce ────────────────
      gsap.utils.toArray('.landing__feature-icon').forEach((icon, i) => {
        gsap.to(icon, { y: -6, duration: 1.5 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.4 });
      });

      // ── How it works cards ─────────────────────────────
      gsap.from('.landing__step-card', {
        y: 80, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.2,
        scrollTrigger: { trigger: stepsRef.current, start: 'top 75%' },
      });

      // ── Step connector line draw ───────────────────────
      gsap.from('.landing__steps-connector', {
        scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power2.inOut',
        scrollTrigger: { trigger: stepsRef.current, start: 'top 70%' },
      });

      // ── CTA section ────────────────────────────────────
      gsap.from('.landing__cta-primary', {
        x: -80, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
      });
      gsap.from('.landing__cta-secondary', {
        x: 80, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: ctaRef.current, start: 'top 75%' },
      });

      // ── Footer slide up ────────────────────────────────
      gsap.from('.landing__footer-inner > *', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.15,
        scrollTrigger: { trigger: '.landing__footer', start: 'top 90%' },
      });

      return () => window.removeEventListener('scroll', handleScroll);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing">
      {/* ── Top Nav ────────────────────────────────────────── */}
      <header ref={navRef} className={`landing__nav ${navScrolled ? 'landing__nav--scrolled' : ''}`}>
        <div className="landing__nav-inner">
          <Link to="/" className="navbar__brand">
            <span className="navbar__brand-accent">Precision</span>Hire
          </Link>
          <div className="landing__nav-actions">
            <Link to="/login" className="btn btn--ghost btn--sm">Sign In</Link>
            <MagneticButton to="/signup" className="btn btn--primary btn--sm">Get Started</MagneticButton>
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="landing__hero" ref={heroRef}>
        <ParticleCanvas />
        <div className="landing__hero-inner container">
          <div className="landing__hero-text">
            <div className="landing__hero-badge">
              <span className="landing__hero-badge-dot" />
              <span>Now hiring across 150+ companies</span>
            </div>
            <h1 className="text-hero landing__hero-title">
              <span className="line">Find Work.</span>{' '}
              <span className="line">
                <span className="landing__hero-accent"><em>Hire Talent.</em></span>
              </span>
              <br />
              <span className="line">No Noise.</span>
            </h1>
            <p className="landing__hero-sub">
              The curated marketplace where high-intent professionals meet top-tier
              companies. No spam, no ghosting, just precision.
            </p>
            <div className="landing__hero-ctas">
              <MagneticButton to="/signup" className="btn btn--primary btn--lg landing__cta-btn">
                Get Hired
                <span className="material-symbols-outlined">arrow_forward</span>
              </MagneticButton>
              <MagneticButton to="/signup" className="btn btn--outline btn--lg">
                Post a Job
              </MagneticButton>
            </div>
            <div className="landing__hero-metrics">
              <div className="landing__hero-metric">
                <span className="landing__hero-metric-value"><AnimCounter end={12000} suffix="+" /></span>
                <span className="landing__hero-metric-label">Active Roles</span>
              </div>
              <div className="landing__hero-metric-divider" />
              <div className="landing__hero-metric">
                <span className="landing__hero-metric-value"><AnimCounter end={50000} suffix="+" /></span>
                <span className="landing__hero-metric-label">Professionals</span>
              </div>
              <div className="landing__hero-metric-divider" />
              <div className="landing__hero-metric">
                <span className="landing__hero-metric-value"><AnimCounter end={92} suffix="%" /></span>
                <span className="landing__hero-metric-label">Response Rate</span>
              </div>
            </div>
          </div>

          {/* ── Decorative Cards (right side) ─────────────── */}
          <div className="landing__hero-visual">
            <div ref={floatCard1Ref} className="landing__float-card landing__float-card--1">
              <div className="landing__float-card-status">
                <span className="landing__status-dot landing__status-dot--active" />
                <span className="text-xsmall" style={{ color: 'var(--brand-teal)' }}>ACTIVE</span>
              </div>
              <h3 className="text-h3" style={{ margin: '8px 0 4px' }}>Senior Product Designer</h3>
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Loom · San Francisco, CA</p>
              <div className="landing__float-card-tags">
                <span className="landing__tag">$160k – $210k</span>
                <span className="landing__tag landing__tag--teal">Remote</span>
              </div>
              <div className="landing__float-card-bar">
                <div className="landing__float-card-bar-fill" style={{ width: '72%' }} />
              </div>
              <span className="text-xsmall" style={{ color: 'var(--text-muted)' }}>72% match</span>
            </div>

            <div ref={floatCard2Ref} className="landing__float-card landing__float-card--2">
              <div className="landing__float-card-row">
                <div className="landing__float-card-avatar">A</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 14 }}>Alex Rivera</h4>
                  <p className="text-xsmall" style={{ color: 'var(--text-muted)' }}>
                    Staff Engineer @ Stripe
                  </p>
                </div>
              </div>
              <div className="landing__float-card-skills">
                <span className="landing__skill-tag">React</span>
                <span className="landing__skill-tag">Node.js</span>
                <span className="landing__skill-tag">TypeScript</span>
              </div>
              <div className="landing__float-card-lines">
                <div className="landing__line landing__line--full" />
                <div className="landing__line landing__line--80" />
              </div>
            </div>

            <div ref={floatCard3Ref} className="landing__float-card landing__float-card--3">
              <div className="landing__notification-icon">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13 }}>Application Accepted!</p>
                <p className="text-xsmall" style={{ color: 'var(--text-muted)' }}>by Vercel · 2m ago</p>
              </div>
            </div>

            <div className="landing__hero-glow" />
            <div className="landing__hero-glow landing__hero-glow--2" />
          </div>
        </div>
      </section>

      {/* ── Trust Strip ───────────────────────────────────── */}
      <section className="landing__trust" ref={trustRef}>
        <div className="container">
          <p className="landing__trust-label font-mono text-xsmall">
            Trusted by 12,000+ industry leaders
          </p>
          <div className="landing__trust-logos">
            {['Stripe', 'Airbnb', 'Vercel', 'Slack', 'GitHub', 'Notion', 'Linear'].map(name => (
              <span key={name} className="landing__trust-logo">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────── */}
      <section className="landing__stats" ref={statsRef}>
        <div className="container">
          <div className="landing__stats-grid">
            <div className="landing__stat-card">
              <div className="landing__stat-icon landing__stat-icon--blue">
                <span className="material-symbols-outlined">work</span>
              </div>
              <span className="landing__stat-number"><AnimCounter end={12000} suffix="+" /></span>
              <span className="landing__stat-label">Active Job Listings</span>
            </div>
            <div className="landing__stat-card">
              <div className="landing__stat-icon landing__stat-icon--teal">
                <span className="material-symbols-outlined">people</span>
              </div>
              <span className="landing__stat-number"><AnimCounter end={50000} suffix="+" /></span>
              <span className="landing__stat-label">Registered Professionals</span>
            </div>
            <div className="landing__stat-card">
              <div className="landing__stat-icon landing__stat-icon--orange">
                <span className="material-symbols-outlined">speed</span>
              </div>
              <span className="landing__stat-number"><AnimCounter end={48} suffix="h" /></span>
              <span className="landing__stat-label">Avg. Response Time</span>
            </div>
            <div className="landing__stat-card">
              <div className="landing__stat-icon landing__stat-icon--green">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <span className="landing__stat-number"><AnimCounter end={92} suffix="%" /></span>
              <span className="landing__stat-label">Employer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="landing__features" ref={featuresRef}>
        <div className="container">
          <div className="landing__section-header">
            <span className="landing__section-tag">Why PrecisionHire</span>
            <h2 className="text-hero font-display">Built for results</h2>
            <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
              Every feature is designed to eliminate friction between talent and opportunity.
            </p>
          </div>
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

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="landing__steps" ref={stepsRef}>
        <div className="container">
          <div className="landing__section-header">
            <span className="landing__section-tag">How It Works</span>
            <h2 className="text-hero font-display">Three steps to your dream role</h2>
            <p className="text-body" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
              From profile creation to offer acceptance — streamlined.
            </p>
          </div>
          <div className="landing__steps-track">
            <div className="landing__steps-connector" />
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
                <div className="landing__step-number landing__step-number--teal">2</div>
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
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section className="landing__cta" ref={ctaRef}>
        <div className="container">
          <div className="landing__cta-grid">
            <div className="landing__cta-primary">
              <div className="landing__cta-orbs">
                <div className="landing__cta-orb landing__cta-orb--1" />
                <div className="landing__cta-orb landing__cta-orb--2" />
              </div>
              <h2 className="text-hero font-display" style={{ color: 'var(--text-inverse)', position: 'relative', zIndex: 2 }}>
                Ready to level up your career?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 420, marginBottom: 32, position: 'relative', zIndex: 2 }}>
                Join 50,000+ professionals already using PrecisionHire to find their dream roles.
              </p>
              <MagneticButton to="/signup" className="btn btn--lg landing__cta-white-btn">
                Start Your Search
              </MagneticButton>
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

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="landing__footer">
        <div className="landing__footer-inner container">
          <div className="landing__footer-brand">
            <Link to="/" className="navbar__brand" style={{ color: 'white' }}>
              <span style={{ color: '#5EEAD4', fontStyle: 'italic' }}>Precision</span>Hire
            </Link>
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
