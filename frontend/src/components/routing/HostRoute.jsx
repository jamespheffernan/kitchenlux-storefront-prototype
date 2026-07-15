import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HostRoute = ({ children }) => {
  const { isAuthenticated, userInfo, loading } = useAuth();

  // Show loading or placeholder while checking authentication
  if (loading) {
    return <div className="loader center-loader"></div>;
  }

  // If user is not authenticated or not a host, redirect to login
  if (!isAuthenticated || !userInfo?.isHost) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated and has host status, render the protected component
  return children;
};

export default HostRoute;