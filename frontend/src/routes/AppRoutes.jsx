import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PartnerRoute, GuestRoute } from '../components/layout/ProtectedRoute';

// FIX: removed stray backtick that caused JSX parse error on line 21
// Added lazy loading for code splitting

const ChooseRegister      = lazy(() => import('../pages/auth/ChooseRegister'));
const UserRegister        = lazy(() => import('../pages/auth/UserRegister'));
const UserLogin           = lazy(() => import('../pages/auth/UserLogin'));
const FoodPartnerRegister = lazy(() => import('../pages/auth/FoodPartnerRegister'));
const FoodPartnerLogin    = lazy(() => import('../pages/auth/FoodPartnerLogin'));
const Home                = lazy(() => import('../pages/general/Home'));
const Profile             = lazy(() => import('../pages/food-partner/Profile'));
const CreateFood          = lazy(() => import('../pages/food-partner/CreateFood'));
const LandingPage         = lazy(() => import('../pages/landing/LandingPage'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0f16',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(249,115,22,0.25)',
        borderTopColor: '#f97316',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing page — public */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Reels feed — public (auth optional for like/save) */}
          <Route path="/" element={<Home />} />

          {/* Auth pages — redirect away if already logged in */}
          <Route path="/register" element={<GuestRoute><ChooseRegister /></GuestRoute>} />
          <Route path="/user/register" element={<GuestRoute><UserRegister /></GuestRoute>} />
          <Route path="/user/login" element={<GuestRoute><UserLogin /></GuestRoute>} />
          <Route path="/food-partner/register" element={<GuestRoute><FoodPartnerRegister /></GuestRoute>} />
          <Route path="/food-partner/login" element={<GuestRoute><FoodPartnerLogin /></GuestRoute>} />

          {/* Food partner protected routes */}
          <Route path="/food-partner/profile" element={<PartnerRoute><Profile /></PartnerRoute>} />
          <Route path="/create-food" element={<PartnerRoute><CreateFood /></PartnerRoute>} />

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
