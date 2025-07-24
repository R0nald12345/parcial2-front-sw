import React, { useState } from 'react';
import { dashboardService } from '../../service/dashboardService'; // Ajusta según tu estructura
import Swal from 'sweetalert2';

const ModalCrearProyecto = ({ open, onClose, proyectos, setProyectos, token }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [permisosEnlace, setPermisosEnlace] = useState("lectura");

    const handleNuevoProyecto = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            alert('El nombre del proyecto es obligatorio');
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                nombre,
                descripcion
            };

            // Enviar a la API usando dashboardService, pasando el token
            const res = await dashboardService.createProyecto(payload, token);

            // Actualizar proyectos localmente (asumiendo que lo añade como "míos")
            setProyectos((prev) => ({
                ...prev,
                administrador: [...prev.administrador, res.proyecto],
            }));

            Swal.fire({
                icon: 'success',
                title: 'Proyecto Creado',
                text: res.message || 'El proyecto ha sido creado correctamente',
            });
            // Resetear estado y cerrar modal
            setNombre('');
            setDescripcion('');
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear proyecto',
                text: error || 'Ha ocurrido un error al crear el proyecto',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-70 z-10 flex items-center justify-center">
            <div className="max-w-lg w-11/12 max-h-[90vh] bg-white shadow-2xl rounded-2xl p-5">
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md font-bold"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-center">
                    Crear Nuevo Proyecto
                </h2>

                <form className="mt-5" onSubmit={handleNuevoProyecto}>
                    <div>
                        <h3 className="font-semibold mt-2">Nombre del Proyecto</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold mt-2">Descripción</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 font-semibold mt-5 text-white py-2 px-5 rounded-xl disabled:bg-green-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando...' : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCrearProyecto;
