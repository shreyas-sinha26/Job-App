import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RoleRoute from '../components/RoleRoute';
import Navbar from '../components/Navbar';
import PageSkeleton from '../components/PageSkeleton';

// ── Public Pages ────────────────────────────────────────────
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const SignupPage = lazy(() => import('../features/auth/SignupPage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));

// ── Jobseeker Pages (Private) ───────────────────────────────
const JobsPage = lazy(() => import('../features/jobs/JobsPage'));
const JobDetailPage = lazy(() => import('../features/jobs/JobDetailPage'));
const ApplicationsPage = lazy(() => import('../features/applications/ApplicationsPage'));

// ── Employer Pages (Private + Role) ─────────────────────────
const ManageJobsPage = lazy(() => import('../features/jobs/ManageJobsPage'));
const EmployerApplicationsPage = lazy(() => import('../features/applications/EmployerApplicationsPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* ── Public ──────────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ── Jobseeker (Private) ─────────────────────────── */}
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <RoleRoute role="jobseeker">
                  <JobsPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <PrivateRoute>
                <RoleRoute role="jobseeker">
                  <JobDetailPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <RoleRoute role="jobseeker">
                  <ApplicationsPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* ── Employer (Private + Role) ───────────────────── */}
          <Route
            path="/employer/jobs"
            element={
              <PrivateRoute>
                <RoleRoute role="employer">
                  <ManageJobsPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/applications"
            element={
              <PrivateRoute>
                <RoleRoute role="employer">
                  <EmployerApplicationsPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
