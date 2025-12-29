// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth(); // Get the current user

  if (!user) {
    // If user is not logged in, redirect them to the /login page
    // 'replace' stops them from using the "back" button to return
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component if exists, otherwise Outlet
  return children ? children : <Outlet />;
}

export default ProtectedRoute;