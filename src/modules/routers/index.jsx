import React from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'


const LoadingFallback = () => <div>Cargando....</div>

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('../auth/routes/RouterAuth'))
const DashboardRoutes = lazy(() => import('../dashboard/route/index'));
const EditorRoutes = lazy(() => import('../editor/page/GraficadoraPrincipal'));


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>

                    {/* Rutas públicas */}
                    <Route 
                        element={<PublicRoute />}>
                        <Route path="/auth/*" element={<AuthRoutes />} />
                    </Route>

                    {/* Rutas protegidas */}
                    <Route element={<ProtectedRoute />}>
                    
                        <Route path="/dashboard" element={<DashboardRoutes/>} /> 
                        {/* <Route path="/editor/*" element={<EditorRoutes />} />  */}
                    </Route>

                    <Route element={<ProtectedRoute />}>
                    
                        <Route path="/graficadora" element={<EditorRoutes/>} /> 
                        {/* <Route path="/editor/*" element={<EditorRoutes />} />  */}
                    </Route>

                    {/* Ruta por defecto */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRoutes