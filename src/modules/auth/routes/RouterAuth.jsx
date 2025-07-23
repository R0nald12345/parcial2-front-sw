import React, { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import RegisterPage from "../page/RegisterPage";

const Login = lazy(() => import('../page/LoginPage'));

const LoadingComponent = () => <div>Cargando...</div>;

const RouterAuth = () => {
    return (
        <Routes>
            <Route path="" element={<Navigate to="login" replace />} />
            <Route path="login" element={
                <Suspense fallback={<LoadingComponent />}>
                    <Login/>
                </Suspense>
            } />
            <Route path="registro" element={
                <Suspense fallback={<LoadingComponent />}>
                    <RegisterPage/>
                </Suspense>
            } />
            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    )
}

export default RouterAuth;