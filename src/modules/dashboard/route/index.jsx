import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Carga diferida de las páginas del dashboard
const DashboardPage = lazy(() => import("../page/DashboardPage"));
// Puedes agregar más páginas si tienes
// const ProfilePage = lazy(() => import("../page/ProfilePage"));

const LoadingComponent = () => <div>Cargando...</div>;

const DashboardRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<LoadingComponent />}>
          <DashboardPage />
        </Suspense>
      }
    />
    {/* Ejemplo de otra ruta interna */}
    {/* <Route
      path="profile"
      element={
        <Suspense fallback={<LoadingComponent />}>
          <ProfilePage />
        </Suspense>
      }
    /> */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default DashboardRoutes;