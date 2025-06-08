import React from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from '../auth/hooks/useAuth.jsx'
// import Dashboard from '../dahsboard/page/Dashboard'
// import AuthRoutes from '../auth/routes'



const LoadingFallback = () => <div>Cargando....</div>

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('../auth/route/index'))
const DashboardRoutes = lazy(() => import('../proyectos/route/index'));
// const DashboardRoutes = lazy(() => import('../dashboard/page/DashboardPage'))
// const EditorRoutes = lazy(() => import('../modules/editor/routes'))

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>

                        {/* Rutas públicas */}
                        <Route element={<PublicRoute />}>
                            <Route path="/*" element={<AuthRoutes />} />
                        </Route>

                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                        
                            <Route path="/dashboard/*" element={<DashboardRoutes/>} /> 
                            {/* <Route path="/editor/*" element={<EditorRoutes />} />  */}
                        </Route>

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes