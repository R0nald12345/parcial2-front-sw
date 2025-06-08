import axios from "axios";


const ruta = 'http://localhost:3000';


// Función auxiliar para obtener el token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFuQGVqZW1wbG8uY29tIiwibm9tYnJlIjoiSnVhbiIsImlhdCI6MTc0OTMzNjMxOSwiZXhwIjoxNzQ5Mzc5NTE5fQ.O4UvLENJY5wwKxmdZl-aJHj_TRgmIY9CG4T1efpQ7E4`
        }
    };
};

export const obtenerProyectos = async(id) =>
    await axios.get(`${ruta}/api/proyectos`, getAuthHeaders());

export const obtenerProyecto = async(id_proyecto) =>
    await axios.get(`${ruta}/api/proyectos/${id_proyecto}`, getAuthHeaders());

export const crearProyecto = async(datos)=>
    await axios.post(`${ruta}/api/proyectos`, datos, getAuthHeaders());

export const eliminarProyecto = async(id) =>
    await axios.delete(`${ruta}/api/proyectos/${id}`, getAuthHeaders());

export const actualizarProyecto = async (id, datos) =>
    await axios.put(`${ruta}/api/proyectos/${id}`, datos, getAuthHeaders());