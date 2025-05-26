import React from 'react'
import { createContext, useState } from "react";
import { crearProyecto, eliminarProyecto, obtenerProyectos } from "../api/api_proyectos";


export const ContextProyectos = createContext();


export const ContextProyectosProvider = ({children}) => {

    const [proyectos, setProyectos]= useState([]);
  


    const obtenerproyectos = async() => {
        const response = await obtenerProyectos();
        console.log(response.data);
        setProyectos(response.data);
    }

    const agregarproyecto = async(datos) => {
        const response = await crearProyecto(datos);
        setProyectos([...proyectos, response.data]);
        console.log(response.data);
    }

    const eliminarproyecto = async(id) => {
        const response = await eliminarProyecto(id);
        setProyectos(proyectos.filter((proyecto) => proyecto.id !== id));
        console.log(response.data);
    }

    const actualizarproyecto = async(id, datos) => {
        const response = await crearProyecto(datos);
        console.log(response.data);
        setProyectos(proyectos.map((proyecto) => (proyecto.id === id ? {...proyecto, ...datos} : proyecto)));
    }       


    return (
        <ContextProyectos.Provider value={{proyectos, obtenerproyectos, agregarproyecto, eliminarproyecto, actualizarproyecto}}>
            {children}
        </ContextProyectos.Provider>
    )
}