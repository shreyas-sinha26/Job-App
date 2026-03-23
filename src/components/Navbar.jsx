import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import './Navbar.css';

/**
 * Navbar — role-aware navigation.
 * Hidden on landing/signup/login pages.
 * Shows different links for jobseeker vs employer.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Hide navbar on public pages (landing, signup, login)
  const hideOnPaths = ['/', '/signup', '/login'];
  if (hideOnPaths.includes(location.pathname)) return null;

  // If not authenticated, don't render (PrivateRoute will redirect)
  if (!isAuthenticated) return null;

  const isEmployer = user?.role === 'employer';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success("You've been signed out.");
  };

  const navLinks = isEmployer
    ? [
        { to: '/employer/jobs', label: 'Manage Jobs' },
        { to: '/employer/applications', label: 'Applications' },
      ]
    : [
        { to: '/jobs', label: 'Jobs' },
        { to: '/applications', label: 'My Applications' },
      ];

  return (
    <header className="navbar">
      <nav className="navbar__inner container">
        {/* Brand */}
        <Link to={isEmployer ? '/employer/jobs' : '/jobs'} className="navbar__brand">
          <span className="navbar__brand-accent">Precision</span>Hire
        </Link>

        {/* Nav Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${
                location.pathname === link.to ? 'navbar__link--active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar__actions">
          {isEmployer && (
            <Link to="/employer/jobs" className="btn btn--primary btn--sm">
              Post a Job
            </Link>
          )}

          {/* User avatar / info */}
          <div className="navbar__user">
            <div className="navbar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="navbar__username">{user?.name || 'User'}</span>
          </div>

          <button onClick={handleLogout} className="btn btn--ghost btn--sm">
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}
