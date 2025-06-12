import React from 'react';
import { TfiText } from "react-icons/tfi";
import { IoTriangleOutline } from "react-icons/io5";
import { Download, Image as ImageIcon, Shapes, Square, Circle, Star, Minus, Trash2, Copy, RotateCw } from 'lucide-react';

// Este componente representa la barra de herramientas inferior del editor.
// Permite crear figuras, cargar imágenes, y manipular elementos seleccionados.
const Toolbar = ({
  shapes,
  onAddShape,
  selectedId,
  selectedIds = [],
  onDeleteShape,
  onDuplicateShape,
  onRotateShape,
  onMoveForward,
  onMoveBackward,
  onAddImage,
}) => {

  // Exportador a Angular (simulado con AngularExporter)
  const handleExport = async () => {
    try {
      const exporter = new window.AngularExporter('my-angular-design');
      await exporter.exportToAngular(shapes);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  // Cuando el usuario selecciona una imagen desde su disco
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && onAddImage) {
      onAddImage(file); // Esta función debe insertar la imagen en el canvas
    }
  };

  // Saber si hay al menos un elemento seleccionado
  const hasSelection = !!selectedId || selectedIds.length > 0;

  return (
    <div className="border-t border-gray-200 bg-gris-semi-oscuro p-2 flex items-center justify-between sticky bottom-0 w-full">
      
      {/* === Herramientas de creación de figuras === */}
      <div className="flex items-center space-x-2">
        {/* Subir imagen */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="p-2 rounded text-white hover:bg-gray-100 hover:text-black cursor-pointer flex items-center justify-center" title="Añadir Imagen">
            <ImageIcon size={20} />
          </label>
        </div>

        {/* Botones de figuras */}
        <button className="p-2 rounded text-white hover:bg-gray-100 hover:text-black" onClick={() => onAddShape('rectangle')} title="Rectángulo">
          <Square size={20} />
        </button>
        <button className="p-2 rounded text-white hover:bg-gray-100 hover:text-black" onClick={() => onAddShape('circle')} title="Círculo">
          <Circle size={20} />
        </button>
        <button className="p-2 rounded text-white hover:bg-gray-100 hover:text-black" onClick={() => onAddShape('star')} title="Estrella">
          <Star size={20} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100" onClick={() => onAddShape('triangle')} title="Triángulo">
          <IoTriangleOutline className="text-white" />
        </button>
        <button className="p-2 rounded text-white hover:bg-gray-100 hover:text-black" onClick={() => onAddShape('line')} title="Línea">
          <Minus size={20} />
        </button>
        <button className="p-2 rounded text-white hover:bg-gray-100" onClick={() => onAddShape('text')} title="Texto">
          <TfiText className="text-white font-bold" />
        </button>

        {/* Exportar diseño */}
        <button className="export-button text-gray-500 border border-gray-300 hover:bg-white p-1 rounded-2xl" onClick={handleExport} title="Exportar a Angular">
          <Download size={18} className="flex justify-center mx-auto"/>
          <span>Exportar a Angular</span>
        </button>
      </div>

      {/* === Herramientas de edición de figuras === */}
      <div className="flex items-center space-x-2">
        {hasSelection && (
          <>
            {onDeleteShape && (
              <button className="p-2 rounded hover:bg-gray-100 text-red-500" onClick={onDeleteShape} title="Eliminar">
                <Trash2 size={20} />
              </button>
            )}
            {onDuplicateShape && (
              <button className="p-2 rounded hover:bg-gray-100" onClick={onDuplicateShape} title="Duplicar">
                <Copy size={20} />
              </button>
            )}
            {onRotateShape && (
              <button className="p-2 rounded hover:bg-gray-100" onClick={onRotateShape} title="Rotar">
                <RotateCw size={20} />
              </button>
            )}

            {/* Reordenar capas */}
            {onMoveForward && (
              <button className="p-2 rounded hover:bg-gray-100 text-white hover:text-black" onClick={onMoveForward} title="Traer al frente">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="8" y="6" width="12" height="12" rx="2" />
                  <rect x="4" y="4" width="8" height="8" rx="2" />
                  <path d="M18 16v2" />
                  <path d="M18 4v6" />
                </svg>
              </button>
            )}

            {onMoveBackward && (
              <button className="p-2 rounded hover:bg-gray-100 text-white hover:text-black" onClick={onMoveBackward} title="Enviar al fondo">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="6" width="12" height="12" rx="2" />
                  <rect x="12" y="4" width="8" height="8" rx="2" />
                  <path d="M6 18v2" />
                  <path d="M6 4v6" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
