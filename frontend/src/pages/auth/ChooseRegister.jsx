import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page">
      <div className="auth-card choose-card">

        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">🎬</div>
          <div className="auth-brand-name">Food<span>Reels</span></div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Join FoodReels</h1>
          <p>Choose how you'd like to get started.</p>
        </div>

        {/* Role cards */}
        <div className="choose-options">

          {/* User option */}
          <Link to="/user/register" className="choose-option" id="choose-user">
            <div className="choose-option-icon">👤</div>
            <div className="choose-option-body">
              <p className="choose-option-title">I'm a User</p>
              <p className="choose-option-desc">Discover and watch food reels from top restaurants.</p>
            </div>
            <span className="choose-option-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </span>
          </Link>

          {/* Food Partner option */}
          <Link to="/food-partner/register" className="choose-option" id="choose-partner">
            <div className="choose-option-icon">🍽️</div>
            <div className="choose-option-body">
              <p className="choose-option-title">I'm a Food Partner</p>
              <p className="choose-option-desc">List your restaurant and reach thousands of food lovers.</p>
            </div>
            <span className="choose-option-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </span>
          </Link>

        </div>

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/user/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default ChooseRegister;
