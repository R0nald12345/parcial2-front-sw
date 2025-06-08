import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const isAuthenticated = !!user;

  useEffect(() => {
    // Cargar datos del localStorage al montar el AuthProvider
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    if (token && userName) {
      setUser({ nombre: userName, tokenSession: token }); // Inicializa el estado del usuario
    }
    setIsLoading(false); // Indica que la carga inicial ha terminado
  }, []);

  const login = async (payload) => {
    setIsLoading(true);
    try {
      const data = await authService.login(payload);
      localStorage.setItem("token", data.user.tokenSession);
      localStorage.setItem("userName", data.user.nombre);
      setUser(data.user);
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);