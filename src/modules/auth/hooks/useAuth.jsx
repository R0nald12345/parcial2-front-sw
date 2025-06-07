import React from 'react'
import { createContext, ReactNode, useContext, useState } from "react";
import Swal from "sweetalert2";
import { authService } from "../service/authService";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (payload) => {
        setIsLoading(true);
        try {
            const data = await authService.login(payload);
            Swal.fire({
                icon: 'success',
                title: 'Inicio de Sesión exitoso',
                text: 'Has iniciado sesión correctamente',
            });
            // Guarda el token y el usuario en localStorage
            localStorage.setItem('token', data.user.tokenSession);
            localStorage.setItem('userName', data.user.nombre);
            setUser(data.user); // Actualiza el estado global/contexto
            setIsLoading(false);
            return data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el inicio de sesión',
                // text: error instanceof Error ? error.message : 'Error inesperado',
            });
            setIsLoading(false);
            throw error;
        }
    };

    const register = async (payload) => {
        try {
            setIsLoading(true);
            await authService.register(payload);
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Tu cuenta ha sido creada correctamente',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: error instanceof Error ? error.message : 'Error inesperado',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook para obtener el contexto de autenticación
 *
 * Lanza un error si no se encuentra dentro de un proveedor de autenticación
 *
 * @returns {AuthContextType} El objeto del contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};