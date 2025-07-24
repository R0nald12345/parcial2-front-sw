import axios from 'axios';

//Me creo  una instancia de Axios con la URL base
const API_URL = import.meta.env.VITE_API_URL;


export const authService = {
    
    async login(payload){
        try {
            const response = await axios.post(`${API_URL}/auth/login`, payload);
            return response.data; // { message, token, usuario }
        } catch (error) {
            throw error.response?.data?.message || "Error de red";
        }
    },

    async register(payload) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, payload);
            return response.data; // { message, token, usuario }
        } catch (error) {
            throw error.response?.data?.message || "Error de red";
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    },
}