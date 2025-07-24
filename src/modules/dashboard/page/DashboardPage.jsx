import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { dashboardService } from "../service/dashboardService";
import ModalCrearProyecto from "../components/modal/ModalCrearProyecto";

import {useAuthStore} from '../../../store/authStore'
import Swal from "sweetalert2";


const DashboardPage=()=> {
  const [vista, setVista] = useState("mios");
  const [proyectos, setProyectos] = useState({ administrador: [], invitado: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const token = useAuthStore(state => state.token);

  console.log('TOKEN', token);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await dashboardService.getProyectos(token); // Debe retornar { administrador: [...], invitado: [...] }
        setProyectos(data);
        console.log('proyectossss', data)
      } catch (err) {
        console.error(err);
        setError("Error al cargar los proyectos");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProyectos();
  }, [token]);

  if (loading) return <div className="text-white p-6">Cargando proyectos...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  const proyectosMostrados = vista === "mios" ? proyectos.administrador : proyectos.invitado;

  // Función para eliminar proyecto
  const handleDeleteProyecto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el proyecto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await dashboardService.deleteProyecto(id, token);
        setProyectos((prev) => ({
          ...prev,
          administrador: prev.administrador.filter((p) => p.id !== id),
        }));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Proyecto eliminado exitosamente",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error,
        });
      }
    }
  };

  return (
    <>
      <ModalCrearProyecto

        open={modalOpen}
        onClose={() => setModalOpen(false)}
        proyectos={proyectos}
        setProyectos={setProyectos}
        token={token}
      />

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Mis Proyectos</h1>

        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setVista("mios")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${vista === "mios" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              Proyectos Míos
            </button>
            <button
              onClick={() => setVista("invitado")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${vista === "invitado" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              Compartidos conmigo
            </button>
          </div>

          <button 
            className="px-4 py-2 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition-all cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            + Crear Proyecto
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {proyectosMostrados.map((proyecto, idx) => (
            <div
              key={proyecto.id || idx}
              className="bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="text-xl font-semibold mb-2 flex justify-between items-center">
                <div>{proyecto.nombre}</div>
                <div className="flex space-x-2">
                  <MdDelete
                    className="bg-red-700 hover:bg-red-900 text-2xl rounded-md p-1 cursor-pointer"
                    onClick={() => handleDeleteProyecto(proyecto.id)}
                  />

                  <FaEdit
                     className="bg-blue-700 hover:bg-blue-900 text-2xl rounded-md p-1 cursor-pointer" 

                  />
                </div>
              </div>
              <div className="text-sm text-gray-400">Editado {proyecto.editado}</div>
            </div>
          ))}
        </div>
      </div>
    </>


  );
}

export default DashboardPage;