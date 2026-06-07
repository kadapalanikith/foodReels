import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — requires the user to be authenticated.
 * Redirects to /user/login if not authenticated.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f16',
        }}
      >
        <div className="auth-loading-spinner" aria-label="Loading…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * PartnerRoute — requires the authenticated principal to be a food partner.
 * Redirects to /food-partner/login if not authenticated as a partner.
 */
export function PartnerRoute({ children }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f16',
        }}
      >
        <div className="auth-loading-spinner" aria-label="Loading…" />
      </div>
    );
  }

  if (role !== 'food-partner') {
    return <Navigate to="/food-partner/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * GuestRoute — redirects authenticated users away from auth pages.
 */
export function GuestRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={role === 'food-partner' ? '/food-partner/profile' : '/'} replace />;
  }

  return children;
}
