import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';

const FoodPartnerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">🎬</div>
          <div className="auth-brand-name">Food<span>Reels</span></div>
        </div>

        {/* Role badge */}
        <div className="auth-role-badge">🍽️ Food Partner</div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Partner sign in</h1>
          <p>Access your dashboard and manage your restaurant's content.</p>
        </div>

        {/* Form */}
        <form className="auth-form" noValidate>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-login-email">Business email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="partner-login-email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="partner@restaurant.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-login-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="partner-login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-input-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="auth-forgot">
            <a href="#">Forgot password?</a>
          </div>

          {/* Submit */}
          <button id="partner-login-btn" type="submit" className="auth-btn-primary">
            Sign In to Dashboard
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Not a partner yet?{' '}
          <Link to="/food-partner/register">Register your restaurant</Link>
        </p>

        {/* Divider + user link */}
        <div className="auth-divider" style={{ marginTop: 'var(--space-6)' }}>
          <span>looking for user access?</span>
        </div>
        <p className="auth-footer" style={{ marginTop: 'var(--space-4)' }}>
          <Link to="/user/login">Sign in as User →</Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
