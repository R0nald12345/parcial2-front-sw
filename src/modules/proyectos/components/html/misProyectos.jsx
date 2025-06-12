







import React, { useContext, useEffect, useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdShare } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import Swal from 'sweetalert2'


import "../css/misProyectos.css"
import { ContextProyectos } from '../../context/context_proyectos'
import SimpleBackdrop from '../backdrop';
import { useNavigate } from 'react-router-dom';

export const Misproyectos = () => {

  const { setProyectos, proyectos, obtenerproyectos, agregarproyecto, eliminarproyecto, actualizarproyecto } = useContext(ContextProyectos);
  const [cargando, setcargando] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    obtenerproyectos();
    console.log('Desde componente MisProyectos: ', proyectos);

  }, []);



  function irAproyecto(id_proyecto) {
    navigate(`/misproyectos/board/${id_proyecto}`);
  }

  const eliminarProyecto = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar este proyecto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'black',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
      });

      if (result.isConfirmed) {
        await eliminarproyecto(id);
      }
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const Agregarproyecto = async () => {
    try {
      const { value: nombre } = await Swal.fire({
        title: "Nombre del proyecto",
        input: "text",
        inputLabel: "nombre de tu proyecto",
        inputPlaceholder: "nombre",
        confirmButtonText: 'aceptar',
        confirmButtonColor: 'black'
      });

      if (!nombre) return; // Si el usuario cancela o no ingresa nombre

      const { value: descripcion } = await Swal.fire({
        title: "Descripcion del proyecto",
        input: "text",
        inputLabel: "Descripcion de tu proyecto",
        inputPlaceholder: "Descripcion",
        confirmButtonText: 'aceptar',
        confirmButtonColor: 'black'
      });

      if (!descripcion) return; // Si el usuario cancela o no ingresa descripción

      // Crear el objeto con los datos del proyecto
      const nuevoProyecto = {
        nombre,
        descripcion,
        permisosenlace: "lectura"
      };

      // Llamar a la función para crear el proyecto
      await agregarproyecto(nuevoProyecto);
  
      // Obtener la lista actualizada de proyectos
      await obtenerproyectos();

      // Mostrar mensaje de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Proyecto creado correctamente',
        icon: 'success',
        confirmButtonColor: 'black'
      });

    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el proyecto',
        icon: 'error',
        confirmButtonColor: 'black'
      });
    }
  };

  return (
    <div className="pagina_proyectos">

      <SimpleBackdrop estado={cargando} />
      <div className="pagina_proyectos_contenedor">
        <div className="pagina_proyectos_contenedor_titulo">
          <h1>Mis proyectos</h1>
        </div>

        <div className="cabezara_proyectos_buscador_agregar">
          <div className="pagina_proyectos_buscador">
            <input

              type="text"
              placeholder="buscar proyecto"

            />
          </div>
        </div>


        <div className="contenedor_cards">
          <div onClick={() => Agregarproyecto()} className="cards_agregar" />

          {proyectos?.administrador && Array.isArray(proyectos.administrador) ? (
            proyectos.administrador.map((proyecto) => (
              <div className="cards" key={proyecto.id}>
                <div className="cards_descripcion">
                  <h1>{proyecto.nombre}</h1>
                  <p>{proyecto.descripcion}</p>
                  <div className="cards_buttons">
                    <button><IoMdShare size={30} /></button>

                    <button><FaEdit size={30} color="#454545" /></button>

                    <button onClick={() => eliminarProyecto(proyecto.id)}><RiDeleteBin5Line size={30} color="#454545" /></button>
                    <button onClick={() => irAproyecto(proyecto.id)}><GoArrowRight size={30} color="#454545" /></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 style={{ fontSize: '20px', marginLeft: '10px' }}>No tienes Proyectos</h1>
          )}
        </div>
      </div>
    </div>
  )
}