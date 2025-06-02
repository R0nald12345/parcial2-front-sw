import React from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"
import LoginPage from "../page/LoginPage";

const Login = lazy(() => import('../page/LoginPage'))
 

// Componente de carga
const LoadingComponent = () => <div>Cargando...</div>;

const AuthRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={
                <Suspense fallback={<LoadingComponent />}>
                    {/* <SeleccionUsuario/> */}
                </Suspense>
            } />
            <Route path="login" element={
                <Suspense fallback={<LoadingComponent />}>
                    <LoginPage/>
                </Suspense>
            } />


            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AuthRoutes;