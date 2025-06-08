import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Asegúrate que la ruta de importación sea correcta
const DashboardPage = lazy(() => import("../pages/pages_proyectos"));

const LoadingComponent = () => <div>Cargando...</div>;

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"  // Añadido /* para permitir rutas anidadas
        element={
          <Suspense fallback={<LoadingComponent />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;