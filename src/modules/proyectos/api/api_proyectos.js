import axios from "axios";


const ruta = 'http://localhost:3000';


// Función auxiliar para obtener el token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };
};

export const obtenerProyectos = async() =>
    await axios.get(`${ruta}/api/proyectos`, getAuthHeaders());

export const obtenerProyecto = async(id_proyecto) =>
    await axios.get(`${ruta}/api/proyectos/${id_proyecto}`, getAuthHeaders());


export const crearProyecto = async(datos) => {
    console.log('datos desde api_proyectos', datos);
    return await axios.post(`${ruta}/api/proyectos`, datos, getAuthHeaders());
}

export const eliminarProyecto = async(id) =>
    await axios.delete(`${ruta}/api/proyectos/${id}`, getAuthHeaders());

export const actualizarProyecto = async (id, datos) =>
    await axios.put(`${ruta}/api/proyectos/${id}`, datos, getAuthHeaders());

