import React from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;