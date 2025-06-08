import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log("PublicRoute isAuthenticated:", isAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;