import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';
import { loginUser } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsUser } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  const validate = (email, password) => {
    const errs = {};
    if (!email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.';
    if (!password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      loginAsUser(res.data.data.user);
      toast({ message: 'Welcome back! 🎉', type: 'success' });
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
          <i className="fa-solid fa-user" aria-hidden="true" /> User
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue watching food reels.</p>
        </div>

        {errors.form && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="user-login-email">Email address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-envelope" />
              </span>
              <input
                id="user-login-email"
                name="email"
                type="email"
                className={`auth-input${errors.email ? ' auth-input--error' : ''}`}
                placeholder="alex@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span id="email-error" className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="user-login-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                id="user-login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input${errors.password ? ' auth-input--error' : ''}`}
                placeholder="Your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                className="auth-input-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((p) => !p)}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
              </button>
            </div>
            {errors.password && <span id="password-error" className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button id="user-login-btn" type="submit" className="auth-btn-primary" disabled={isLoading}>
            {isLoading
              ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Signing in…</>
              : <><i className="fa-solid fa-arrow-right-to-bracket" aria-hidden="true" /> Sign In</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/user/register">Create one</Link>
        </p>

        <div className="auth-divider" style={{ marginTop: 'var(--space-6)' }}>
          <span>are you a business?</span>
        </div>
        <p className="auth-footer" style={{ marginTop: 'var(--space-4)' }}>
          <Link to="/food-partner/login">
            Sign in as Food Partner <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
