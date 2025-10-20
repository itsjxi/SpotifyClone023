import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;