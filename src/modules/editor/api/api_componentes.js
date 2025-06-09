
import axios from "axios";

const ruta = 'http://localhost:3000';

export const obtenerComponentes = async () =>
    await axios.get(`${ruta}/api/componentes`);


export const crearComponentes = async (datos) =>
    await axios.post(`${ruta}/api/componentes`, datos); 

export const obtenerPaginas = async () =>
    await axios.get(`${ruta}/api/paginas`);




