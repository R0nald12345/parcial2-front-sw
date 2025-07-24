import { useAuthStore } from '../../../store/authStore';

// Hook para acceder a los datos de auth desde Zustand
export const useAuth = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const setAuth = useAuthStore(state => state.setAuth);
  const logout = useAuthStore(state => state.logout);

  return { user, token, isAuthenticated, setAuth, logout };
};
