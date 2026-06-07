import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';
import { loginPartner } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsPartner } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/food-partner/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const errs = {};
    if (!email) errs.email = 'Email is required.';
    if (!password) errs.password = 'Password is required.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await loginPartner({ email, password });
      loginAsPartner(res.data.data.partner);
      toast({ message: 'Welcome back, partner! 🍽️', type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast({ message: msg, type: 'error' });
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            <i className="fa-solid fa-clapperboard" />
          </div>
          <div className="auth-brand-name">Food<span>Reels</span></div>
        </div>

        <div className="auth-role-badge">
          <i className="fa-solid fa-store" aria-hidden="true" /> Food Partner
        </div>

        <div className="auth-heading">
          <h1>Partner sign in</h1>
          <p>Access your dashboard and manage your restaurant's content.</p>
        </div>

        {errors.form && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-login-email">Business email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-envelope" />
              </span>
              <input id="partner-login-email" name="email" type="email"
                className={`auth-input${errors.email ? ' auth-input--error' : ''}`}
                placeholder="partner@restaurant.com" autoComplete="email" disabled={isLoading} />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-login-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-lock" />
              </span>
              <input id="partner-login-password" name="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input${errors.password ? ' auth-input--error' : ''}`}
                placeholder="Your password" autoComplete="current-password" disabled={isLoading} />
              <button type="button" className="auth-input-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((p) => !p)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button id="partner-login-btn" type="submit" className="auth-btn-primary" disabled={isLoading}>
            {isLoading
              ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Signing in…</>
              : <><i className="fa-solid fa-arrow-right-to-bracket" aria-hidden="true" /> Sign In to Dashboard</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Not a partner yet? <Link to="/food-partner/register">Register your restaurant</Link>
        </p>

        <div className="auth-divider" style={{ marginTop: 'var(--space-6)' }}>
          <span>looking for user access?</span>
        </div>
        <p className="auth-footer" style={{ marginTop: 'var(--space-4)' }}>
          <Link to="/user/login">
            Sign in as User <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
