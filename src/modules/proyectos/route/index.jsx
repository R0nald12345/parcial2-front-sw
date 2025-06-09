import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ContextProyectosProvider } from "../context/context_proyectos";
import EditorGrapes from "../../editor/page/Graficadora";

const PagesMisProyectos = lazy(() => import("../pages/pages_proyectos"));
// Asegúrate de importar RegisterPage si lo vas a usar
// const RegisterPage = lazy(() => import("../pages/RegisterPage"));

const LoadingComponent = () => <div>Cargando...</div>;

const DashboardRoutes = () => {
  return (
    <ContextProyectosProvider>
      <Routes>
        {/* Ruta principal del dashboard - sin el prefijo "dashboard" porque ya viene en la URL */}
        <Route
          path="/"  
          element={
            <Suspense fallback={<LoadingComponent />}>
              <PagesMisProyectos />
            </Suspense>
          }
        />

        {/* Ruta para el tablero de proyectos */}
        <Route 
          path="/board/:id_board" 
          element={
            <Suspense fallback={<LoadingComponent />}>
              {/* Cambia RegisterPage por el componente correcto */}
              {/* <PagesMisProyectos /> */}
              <EditorGrapes />
            </Suspense>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContextProyectosProvider>
  );
};

export default DashboardRoutes;