import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si ya está autenticado, redirige al dashboard
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;