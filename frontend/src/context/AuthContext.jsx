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
  const [user, setUser] = useState(() =>
    localStorage.getItem('authToken') ? jwtDecode(JSON.parse(localStorage.getItem('authToken')).access) : null
  );
  const [loading, setLoading] = useState(false);

  // --- Login Function ---
  // This will be called from our LoginPage
  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      // 1. Get tokens from the DRF 'simple-jwt' endpoint
      // If isAdmin is true, use the dedicated admin endpoint
      const endpoint = isAdmin ? '/api/auth/admin-login/' : '/api/auth/token/';

      const response = await api.post(endpoint, {
        email,
        password,
      });

      const tokens = response.data;
      const decodedUser = jwtDecode(tokens.access); // Decode the access token

      // 2. Save data to state and localStorage
      setAuthToken(tokens);
      setUser(decodedUser);
      console.log();
      localStorage.setItem('authToken', JSON.stringify(tokens));

      return decodedUser; // Signal success and return user data
    } catch (err) {
      console.error('Login error:', err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Logout Function ---
  const logout = () => {
    // Clear state and localStorage
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // Provide the context values to all child components
  const contextData = {
    user,
    authToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Custom Hook ---
// This is a helper hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;