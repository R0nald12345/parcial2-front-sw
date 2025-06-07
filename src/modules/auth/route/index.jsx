import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoginPage from "../page/LoginPage";
import RegisterPage from "../page/RegisterPage"; // <-- Importa RegisterPage

// Componente de carga
const LoadingComponent = () => <div>Cargando...</div>;

const AuthRoutes = () => {
    return (
        <Routes>
            
            <Route path="login" element={
                <Suspense fallback={<LoadingComponent />}>
                    <LoginPage />
                </Suspense>
            } />
            <Route path="register" element={
                <Suspense fallback={<LoadingComponent />}>
                    <RegisterPage />
                </Suspense>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AuthRoutes;