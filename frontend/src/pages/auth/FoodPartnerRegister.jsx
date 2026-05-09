import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';

const FoodPartnerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          <h1>Partner with us</h1>
          <p>List your restaurant and reach thousands of food lovers.</p>
        </div>

        {/* Form */}
        <form className="auth-form" noValidate>

          {/* Restaurant name — maps to model: name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-name">Restaurant name</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              <input
                id="partner-name"
                name="name"
                type="text"
                className="auth-input"
                placeholder="Spice Garden"
                autoComplete="organization"
              />
            </div>
          </div>

          {/* Contact name — maps to model: contactName */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-contactName">Contact name</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="partner-contactName"
                name="contactName"
                type="text"
                className="auth-input"
                placeholder="Ravi Kumar"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email — maps to model: email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-email">Business email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="partner-email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="partner@restaurant.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Phone — maps to model: phone */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-phone">Phone number</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.4 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.14-1.14a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input
                id="partner-phone"
                name="phone"
                type="tel"
                className="auth-input"
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Address — maps to model: address */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-address">Restaurant address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <input
                id="partner-address"
                name="address"
                type="text"
                className="auth-input"
                placeholder="123 MG Road, Bengaluru"
                autoComplete="street-address"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="partner-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
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

          {/* Confirm */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-confirm">Confirm password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="partner-confirm"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="auth-input"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-input-toggle"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setShowConfirm(p => !p)}
              >
                {showConfirm ? (
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

          {/* Submit */}
          <button id="partner-register-btn" type="submit" className="auth-btn-primary">
            Register as Partner
          </button>

          <p className="auth-terms">
            By registering you agree to our{' '}
            <a href="#">Partner Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Already a partner?{' '}
          <Link to="/food-partner/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
