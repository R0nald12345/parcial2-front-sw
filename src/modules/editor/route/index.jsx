import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Carga diferida de las páginas del dashboard
const EditorPage = lazy(() => import("../page/GraficadoraPrincipal"));
// Puedes agregar más páginas si tienes
// const ProfilePage = lazy(() => import("../page/ProfilePage"));

const LoadingComponent = () => <div>Cargando...</div>;

const EditorRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<LoadingComponent />}>
          <EditorPage />
        </Suspense>
      }
    />
 
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default EditorRoutes;