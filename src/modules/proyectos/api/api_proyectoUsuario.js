import axios from "axios";


const ruta = 'http://localhost:3000';

export const obtenerProyectosUsuario = async (id) => 
    await axios.get(`${ruta}/api/usuario-proyecto/usuario/${id}`)