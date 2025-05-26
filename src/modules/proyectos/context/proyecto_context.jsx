import React from 'react'
import { Outlet } from "react-router-dom"
import { ContextProyectosProvider } from "./context_proyectos"




export const ProyectoContext = () => {
    return <ContextProyectosProvider>
               <Outlet/>
           </ContextProyectosProvider>
}