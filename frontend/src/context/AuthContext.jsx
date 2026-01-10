// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // We need this to decode the token
import api from '../utils/api';

// Create the context
const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  // Try to get auth data from localStorage on initial load
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null
  );

  // Backup Token for Impersonation (Stores the SuperAdmin's token)
  const [adminBackupToken, setAdminBackupToken] = useState(() =>
    localStorage.getItem('adminBackupToken') ? JSON.parse(localStorage.getItem('adminBackupToken')) : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('authToken') ? jwtDecode(JSON.parse(localStorage.getItem('authToken')).access) : null
  );

  const [loading, setLoading] = useState(false);

  // Derived state: distinct from user logic to avoid issues
  const isImpersonating = !!adminBackupToken;

  // --- Login Function ---
  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? '/api/auth/admin-login/' : '/api/auth/token/';
      const response = await api.post(endpoint, { email, password });
      const tokens = response.data;
      const decodedUser = jwtDecode(tokens.access);

      setAuthToken(tokens);
      setUser(decodedUser);
      localStorage.setItem('authToken', JSON.stringify(tokens));

      return decodedUser;
    } catch (err) {
      console.error('Login error:', err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Logout Function ---
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setAdminBackupToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminBackupToken');
  };

  // --- Impersonate Function ---
  const impersonate = async (userId, reason) => {
    setLoading(true);
    try {
      // 1. Call Backend to get Target User Tokens
      const response = await api.post('/api/auth/admin/impersonate/', { user_id: userId, reason });
      const { access, refresh } = response.data;

      // 2. Backup Current Admin Token
      if (!authToken) throw new Error("No admin token found");
      setAdminBackupToken(authToken);
      localStorage.setItem('adminBackupToken', JSON.stringify(authToken));

      // 3. Set New Impersonated Token
      const newTokens = { access, refresh };
      const decodedUser = jwtDecode(access);

      setAuthToken(newTokens);
      setUser(decodedUser);
      localStorage.setItem('authToken', JSON.stringify(newTokens));

      return decodedUser;
    } catch (err) {
      console.error("Impersonation Failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Stop Impersonation Function ---
  const stopImpersonation = () => {
    if (!adminBackupToken) return;

    // Restore Admin Token
    const decodedUser = jwtDecode(adminBackupToken.access);

    setAuthToken(adminBackupToken);
    setUser(decodedUser);
    localStorage.setItem('authToken', JSON.stringify(adminBackupToken));

    // Clear Backup
    setAdminBackupToken(null);
    localStorage.removeItem('adminBackupToken');
  };

  // Provide the context values to all child components
  const contextData = {
    user,
    authToken,
    loading,
    login,
    logout,
    impersonate,
    stopImpersonation,
    isImpersonating
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;