import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/auth.css';
import { registerPartner } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const { loginAsPartner } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Restaurant name is required.';
    if (!data.contactName.trim()) errs.contactName = 'Contact name is required.';
    if (!data.email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email.';
    if (!data.phone.trim()) errs.phone = 'Phone number is required.';
    if (!data.address.trim()) errs.address = 'Address is required.';
    if (!data.password) errs.password = 'Password is required.';
    else if (data.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      contactName: e.target.contactName.value,
      email: e.target.email.value.trim(),
      phone: e.target.phone.value,
      address: e.target.address.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...payload } = data; // eslint-disable-line no-unused-vars
      const res = await registerPartner(payload);
      loginAsPartner(res.data.data.partner);
      toast({ message: 'Restaurant registered! Welcome to FoodReels 🍽️', type: 'success' });
      navigate('/food-partner/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast({ message: msg, type: 'error' });
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Reusable password-toggle field ── */
  const PasswordField = ({ id, name, label, show, onToggle, placeholder, autoComplete, error }) => (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrapper">
        <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-lock" /></span>
        <input id={id} name={name} type={show ? 'text' : 'password'}
          className={`auth-input${error ? ' auth-input--error' : ''}`}
          placeholder={placeholder} autoComplete={autoComplete} disabled={isLoading} />
        <button type="button" className="auth-input-toggle"
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={onToggle}>
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
        </button>
      </div>
      {error && <span className="auth-field-error">{error}</span>}
    </div>
  );

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
          <h1>Partner with us</h1>
          <p>List your restaurant and reach thousands of food lovers.</p>
        </div>

        {errors.form && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> {errors.form}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Restaurant name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-name">Restaurant name</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-store" /></span>
              <input id="partner-name" name="name" type="text"
                className={`auth-input${errors.name ? ' auth-input--error' : ''}`}
                placeholder="Spice Garden" autoComplete="organization" disabled={isLoading} />
            </div>
            {errors.name && <span className="auth-field-error">{errors.name}</span>}
          </div>

          {/* Contact name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-contactName">Contact name</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-user-tie" /></span>
              <input id="partner-contactName" name="contactName" type="text"
                className={`auth-input${errors.contactName ? ' auth-input--error' : ''}`}
                placeholder="Ravi Kumar" autoComplete="name" disabled={isLoading} />
            </div>
            {errors.contactName && <span className="auth-field-error">{errors.contactName}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-email">Business email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-envelope" /></span>
              <input id="partner-email" name="email" type="email"
                className={`auth-input${errors.email ? ' auth-input--error' : ''}`}
                placeholder="partner@restaurant.com" autoComplete="email" disabled={isLoading} />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-phone">Phone number</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-phone" /></span>
              <input id="partner-phone" name="phone" type="tel"
                className={`auth-input${errors.phone ? ' auth-input--error' : ''}`}
                placeholder="+91 98765 43210" autoComplete="tel" disabled={isLoading} />
            </div>
            {errors.phone && <span className="auth-field-error">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="partner-address">Restaurant address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true"><i className="fa-solid fa-location-dot" /></span>
              <input id="partner-address" name="address" type="text"
                className={`auth-input${errors.address ? ' auth-input--error' : ''}`}
                placeholder="123 MG Road, Bengaluru" autoComplete="street-address" disabled={isLoading} />
            </div>
            {errors.address && <span className="auth-field-error">{errors.address}</span>}
          </div>

          <PasswordField id="partner-password" name="password" label="Password"
            show={showPassword} onToggle={() => setShowPassword((p) => !p)}
            placeholder="Min. 8 characters" autoComplete="new-password" error={errors.password} />

          <PasswordField id="partner-confirm" name="confirmPassword" label="Confirm password"
            show={showConfirm} onToggle={() => setShowConfirm((p) => !p)}
            placeholder="Re-enter your password" autoComplete="new-password" error={errors.confirmPassword} />

          <button id="partner-register-btn" type="submit" className="auth-btn-primary" disabled={isLoading}>
            {isLoading
              ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> Registering…</>
              : <><i className="fa-solid fa-store" aria-hidden="true" /> Register as Partner</>
            }
          </button>

          <p className="auth-terms">
            By registering you agree to our <a href="#">Partner Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </form>

        <p className="auth-footer">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
