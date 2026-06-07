import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser, logoutPartner } from '../api/auth.api';

const AuthContext = createContext(null);

const USER_KEY = 'foodreels_user';
const PARTNER_KEY = 'foodreels_partner';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [partner, setPartner] = useState(() => {
    try {
      const stored = localStorage.getItem(PARTNER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!(user || partner);
  const role = user ? 'user' : partner ? 'food-partner' : null;

  // Rehydrate on mount by verifying the cookie with the server
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await getMe();
        const { data } = res.data;
        if (data?.role === 'user') {
          setUser(data.user);
          setPartner(null);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          localStorage.removeItem(PARTNER_KEY);
        } else if (data?.role === 'food-partner') {
          setPartner(data.partner);
          setUser(null);
          localStorage.setItem(PARTNER_KEY, JSON.stringify(data.partner));
          localStorage.removeItem(USER_KEY);
        }
      } catch {
        // Token invalid or expired — clear local state
        setUser(null);
        setPartner(null);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PARTNER_KEY);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const loginAsUser = useCallback((userData) => {
    setUser(userData);
    setPartner(null);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.removeItem(PARTNER_KEY);
  }, []);

  const loginAsPartner = useCallback((partnerData) => {
    setPartner(partnerData);
    setUser(null);
    localStorage.setItem(PARTNER_KEY, JSON.stringify(partnerData));
    localStorage.removeItem(USER_KEY);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user) await logoutUser();
      if (partner) await logoutPartner();
    } catch { /* ignore network errors on logout */ }
    setUser(null);
    setPartner(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PARTNER_KEY);
  }, [user, partner]);

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isAuthenticated,
        role,
        loading,
        loginAsUser,
        loginAsPartner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
