import React from 'react'
import { createContext, useState } from "react";
import { crearProyecto, eliminarProyecto, obtenerProyectos } from "../api/api_proyectos";


export const ContextProyectos = createContext();


export const ContextProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);



    const obtenerproyectos = async () => {
        try {
            const response = await obtenerProyectos();
            console.log('Proyectos obtenidos:', response.data);
            setProyectos(response.data);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
            setProyectos([]);
        }
    }

    const agregarproyecto = async (datos) => {
        try {
            const response = await crearProyecto(datos);
            console.log('Proyecto creado:', response.data);
            setProyectos(prevProyectos => Array.isArray(prevProyectos)
                ? [...prevProyectos, response.data]
                : [response.data]
            );
            return response.data;
        } catch (error) {
            console.error("Error al crear proyecto:", error);
            throw error;
        }
    }

    const eliminarproyecto = async (id) => {
        const response = await eliminarProyecto(id);
        setProyectos((prevProyectos) => ({
            ...prevProyectos,
            administrador: prevProyectos.administrador.filter((proyecto) => proyecto.id !== id)
        }));
        // console.log(response.data);
    }

    const actualizarproyecto = async (id, datos) => {
        const response = await crearProyecto(datos);
        console.log(response.data);
        setProyectos(proyectos.map((proyecto) => (proyecto.id === id ? { ...proyecto, ...datos } : proyecto)));
    }


    return (
        <ContextProyectos.Provider value={{ setProyectos, proyectos, obtenerproyectos, agregarproyecto, eliminarproyecto, actualizarproyecto }}>
            {children}
        </ContextProyectos.Provider>
    )
}