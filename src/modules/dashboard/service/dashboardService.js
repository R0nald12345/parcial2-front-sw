import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token en localStorage');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const dashboardService = {
  async createDashboard(payload) {
    try {
      const response = await axios.post(`${API_URL}/dashboard`, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  },

  async getProyectos() {
    try {
      const response = await axios.get(`${API_URL}/proyectos`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
};
