import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { dashboardService } from "../service/dashboardService";

// ⚠️ Asegúrate de importar correctamente tu servicio:
// import dashboardService from "../services/dashboardService"; // Ajusta la ruta según tu estructura

export default function DashboardPage() {
  const [vista, setVista] = useState("mios");
  const [proyectos, setProyectos] = useState({ administrador: [], invitado: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await dashboardService.getProyectos(); // Debe retornar { administrador: [...], invitado: [...] }
        setProyectos(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los proyectos");
      } finally {
        setLoading(false);
      }
    };
    fetchProyectos();
  }, []);

  if (loading) return <div className="text-white p-6">Cargando proyectos...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  const proyectosMostrados = vista === "mios" ? proyectos.administrador : proyectos.invitado;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Proyectos</h1>

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setVista("mios")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              vista === "mios" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Proyectos Míos
          </button>
          <button
            onClick={() => setVista("invitado")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              vista === "invitado" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Compartidos conmigo
          </button>
        </div>

        <button className="px-4 py-2 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition-all cursor-pointer">
          + Crear Proyecto
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {proyectosMostrados.map((proyecto, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-xl font-semibold mb-2 flex justify-between items-center">
              <div>{proyecto.nombre}</div>
              <div className="flex space-x-2">
                <MdDelete className="bg-red-700 hover:bg-red-900 text-2xl rounded-md p-1 cursor-pointer" />
                <FaEdit className="bg-blue-700 hover:bg-blue-900 text-2xl rounded-md p-1 cursor-pointer" />
              </div>
            </div>
            <div className="text-sm text-gray-400">Editado {proyecto.editado}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
