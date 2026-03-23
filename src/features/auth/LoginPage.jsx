import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearAuthError, selectAuthStatus, selectAuthError, selectUserRole, selectCurrentUser } from './authSlice';
import { AlertCircle, X, ArrowRight, Eye, EyeOff, CheckCircle2, Briefcase, Github } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import './AuthLayout.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const status = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const role = useSelector(selectUserRole);
  const user = useSelector(selectCurrentUser);
  const isLoading = status === 'loading';

  const [showPassword, setShowPassword] = useState(false);

  // Where the user came from (if redirected by PrivateRoute)
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, touchedFields, isValid },
  } = useForm({ mode: 'onTouched' });

  // Clear auth error on mount
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (status === 'succeeded' && role) {
      toast.success(`Welcome back, ${user?.name || ''}!`);
      // If there's a saved location, go back there; otherwise role-based dashboard
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(role === 'employer' ? '/employer/jobs' : '/jobs', { replace: true });
      }
    }
  }, [status, role, user, navigate, from]);

  const onSubmit = (data) => {
    dispatch(loginUser({
      email: data.email,
      password: data.password,
    }));
  };

  const getFieldState = (fieldName) => {
    if (errors[fieldName]) return 'error';
    if (dirtyFields[fieldName] && touchedFields[fieldName] && !errors[fieldName]) return 'valid';
    return 'neutral';
  };

  return (
    <>
      {/* Minimal Nav */}
      <header className="auth-nav">
        <div className="auth-nav__inner">
          <Link to="/" className="auth-nav__brand">PrecisionHire</Link>
          <div className="auth-nav__right">
            <span className="auth-nav__right-text">Don't have an account?</span>
            <Link to="/signup" className="auth-nav__right-link">Sign up →</Link>
          </div>
        </div>
      </header>

      <main className="auth-layout">
        {/* ── Left Panel ──────────────────────────────────── */}
        <section className="auth-left">
          <div className="auth-left__blob-1" />
          <div className="auth-left__blob-2" />
          <div className="auth-left__content">
            <h1 className="auth-left__hero">
              Welcome back. Let's pick up where you left off.
            </h1>
            <div className="auth-proof-cards">
              <div className="auth-proof-card">
                <div className="auth-proof-card__icon auth-proof-card__icon--teal">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="auth-proof-card__label">Active Roles</p>
                  <p className="auth-proof-card__text">12,000+ open positions worldwide</p>
                </div>
              </div>
              <div className="auth-proof-card">
                <div className="auth-proof-card__icon auth-proof-card__icon--blue">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="auth-proof-card__label">Quick Apply</p>
                  <p className="auth-proof-card__text">One-click application in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Right Panel (Form) ──────────────────────────── */}
        <section className="auth-right">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Welcome Back</h2>
              <p className="auth-form-subtitle">Sign in to your account to continue.</p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="auth-error-banner" style={{ marginBottom: 20 }}>
                <AlertCircle size={18} className="auth-error-banner__icon" />
                <span className="auth-error-banner__text">{authError}</span>
                <button
                  className="auth-error-banner__close"
                  onClick={() => dispatch(clearAuthError())}
                  aria-label="Dismiss error"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <div className="auth-field">
                <label className="auth-field__label" htmlFor="login-email">Email Address</label>
                <div className="auth-field__input-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    className={`auth-field__input ${getFieldState('email') === 'error' ? 'auth-field__input--error' : ''} ${getFieldState('email') === 'valid' ? 'auth-field__input--valid' : ''}`}
                    placeholder="john@company.com"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                  {getFieldState('email') === 'valid' && (
                    <span className="auth-field__icon auth-field__icon--visible auth-field__icon--success">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
                {errors.email && <span className="auth-field__error">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-field__label" htmlFor="login-password">Password</label>
                <div className="auth-field__input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`auth-field__input ${getFieldState('password') === 'error' ? 'auth-field__input--error' : ''} ${getFieldState('password') === 'valid' ? 'auth-field__input--valid' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <button
                    type="button"
                    className="auth-field__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="auth-field__error">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <Spinner variant="white" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="auth-submit__arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <hr className="auth-divider__line" />
              <span className="auth-divider__text">Or continue with</span>
            </div>

            {/* Social Login (visual only) */}
            <div className="auth-social-row">
              <button type="button" className="auth-social-btn" onClick={() => toast('Google login coming soon!')}>
                <svg className="auth-social-btn__icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="auth-social-btn" onClick={() => toast('GitHub login coming soon!')}>
                <Github size={20} />
                Github
              </button>
            </div>

            {/* Mobile-only link */}
            <div className="auth-mobile-link">
              <Link to="/signup">Don't have an account? Sign up →</Link>
            </div>

            {/* Footer */}
            <footer className="auth-footer">
              <p className="auth-footer__copy">© 2024 PrecisionHire</p>
              <div className="auth-footer__links">
                <a href="#" className="auth-footer__link" onClick={(e) => e.preventDefault()}>Support</a>
                <a href="#" className="auth-footer__link" onClick={(e) => e.preventDefault()}>Privacy</a>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
