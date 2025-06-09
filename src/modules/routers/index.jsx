import React from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from '../auth/hooks/useAuth.jsx'

const LoadingFallback = () => <div>Cargando....</div>

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('../auth/route/index'))
const DashboardRoutes = lazy(() => import('../proyectos/route/index'));

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route element={<PublicRoute />}>
                            <Route path="/auth/*" element={<AuthRoutes />} />
                        </Route>

                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard/*" element={<DashboardRoutes/>} />
                            <Route path="/misproyectos/*" element={<DashboardRoutes/>} />
                        </Route>

                        {/* Ruta por defecto - redirige a auth si no está autenticado */}
                        <Route path="/" element={<Navigate to="/auth/login" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes