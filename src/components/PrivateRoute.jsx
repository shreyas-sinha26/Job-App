import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../features/auth/authSlice';

/**
 * PrivateRoute — wraps children and redirects to /login
 * if no auth token is present in Redux store.
 *
 * Preserves the intended destination via location state
 * so login can redirect back after success.
 */
export default function PrivateRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
