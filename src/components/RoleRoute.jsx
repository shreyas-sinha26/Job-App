import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUserRole, selectIsAuthenticated } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

/**
 * RoleRoute — checks user.role matches the required role.
 *
 * If not authenticated → redirect /login
 * If wrong role        → redirect to their correct dashboard
 *
 * Usage: <RoleRoute role="employer"><ManageJobsPage /></RoleRoute>
 */
export default function RoleRoute({ role, children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const isMismatch = isAuthenticated && userRole !== role;

  useEffect(() => {
    if (isMismatch) {
      toast.error("You don't have access to this page.");
    }
  }, [isMismatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isMismatch) {
    // Redirect each role to their landing page
    const fallback = userRole === 'employer' ? '/employer/jobs' : '/jobs';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
