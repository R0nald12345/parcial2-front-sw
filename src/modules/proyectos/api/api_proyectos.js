import axios from "axios";


const ruta = 'http://localhost:3000';

export const obtenerProyectos = async(id) =>
    await axios.get(`${ruta}/api/proyectos`);


export const obtenerProyecto = async(id_proyecto) =>
    await axios.get(`${ruta}/api/proyectos/${id_proyecto}`);

export const crearProyecto = async(datos)=>
    await axios.post(`${ruta}/api/proyectos`, datos);

export const eliminarProyecto = async(id) =>
    await axios.delete(`${ruta}/api/proyectos/${id}`);

export const actualizarProyecto = async (id, datos) =>
    await axios.put(`${ruta}/api/proyectos/${id}`, datos);