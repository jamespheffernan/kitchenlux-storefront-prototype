import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loader"></div>;
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;