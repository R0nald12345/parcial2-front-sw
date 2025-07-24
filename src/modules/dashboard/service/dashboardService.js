import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const dashboardService = {
  // Crear proyecto
  async createProyecto(payload, token) {
    try {
      const response = await axios.post(`${API_URL}/projects`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // { message, proyecto }
    } catch (error) {
      console.error('Error creating proyecto:', error);
      throw error.response?.data?.message || "Error al crear proyecto";
    }
  },

  // Obtener todos los proyectos
  async getProyectos(token) {
    try {
      const res = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.proyectos; // { administrador: [], invitado: [] }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error.response?.data?.message || "Error al obtener proyectos";
    }
  },

  async deleteProyecto(id, token) {
    try {
      const res = await axios.delete(`${API_URL}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // { message: "Proyecto eliminado exitosamente" }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error.response?.data?.message || "Error al eliminar proyecto";
    }
  },

  async invitarUsuario(email, proyectoId, token) {
    try {
      const res = await axios.post(`${API_URL}/invites`, {
        email,
        proyectoId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // { message: "...", ... }
    } catch (error) {
      console.error('Error invitando usuario:', error);
      throw error.response?.data?.message || "Error al invitar usuario";
    }
  },
};
