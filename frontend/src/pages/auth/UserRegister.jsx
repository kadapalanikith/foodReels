import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';
import { registerUser } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const UserRegister = () => {
  const navigate = useNavigate();
  const { loginAsUser } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email.';
    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(formData.password)) errs.password = 'Password must contain an uppercase letter.';
    else if (!/[0-9]/.test(formData.password)) errs.password = 'Password must contain a number.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      loginAsUser(res.data.data.user);
      toast({ message: 'Account created! Welcome to FoodReels 🎉', type: 'success' });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
          <h1>Create your account</h1>
          <p>Join FoodReels and start discovering amazing food videos.</p>
        </div>

        {errors.form && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-field-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="user-firstName">First name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon" aria-hidden="true">
                  <i className="fa-solid fa-user" />
                </span>
                <input id="user-firstName" name="firstName" type="text"
                  className={`auth-input${errors.firstName ? ' auth-input--error' : ''}`}
                  placeholder="Alex" value={formData.firstName} onChange={handleChange}
                  autoComplete="given-name" disabled={isLoading} />
              </div>
              {errors.firstName && <span className="auth-field-error">{errors.firstName}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="user-lastName">Last name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon" aria-hidden="true">
                  <i className="fa-solid fa-user" />
                </span>
                <input id="user-lastName" name="lastName" type="text"
                  className={`auth-input${errors.lastName ? ' auth-input--error' : ''}`}
                  placeholder="Smith" value={formData.lastName} onChange={handleChange}
                  autoComplete="family-name" disabled={isLoading} />
              </div>
              {errors.lastName && <span className="auth-field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="user-email">Email address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-envelope" />
              </span>
              <input id="user-email" name="email" type="email"
                className={`auth-input${errors.email ? ' auth-input--error' : ''}`}
                placeholder="alex@example.com" value={formData.email} onChange={handleChange}
                autoComplete="email" disabled={isLoading} />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="user-password">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">
                <i className="fa-solid fa-lock" />
              </span>
              <input id="user-password" name="password" type={showPassword ? 'text' : 'password'}
                className={`auth-input${errors.password ? ' auth-input--error' : ''}`}
                placeholder="Min. 8 characters" value={formData.password} onChange={handleChange}
                autoComplete="new-password" disabled={isLoading} />
              <button type="button" className="auth-input-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((p) => !p)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <button id="user-register-btn" type="submit" className="auth-btn-primary" disabled={isLoading}>
            {isLoading
              ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Creating account…</>
              : <><i className="fa-solid fa-user-plus" aria-hidden="true" /> Create Account</>
            }
          </button>

          <p className="auth-terms">
            By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
