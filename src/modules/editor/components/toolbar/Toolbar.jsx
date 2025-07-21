import React from 'react';
import { TfiText } from "react-icons/tfi";
import { IoTriangleOutline } from "react-icons/io5";
import { Shapes, Square, Circle, Star, Minus } from 'lucide-react';


// Este componente representa la barra de herramientas inferior del editor.
// Permite crear figuras, cargar imágenes, y manipular elementos seleccionados.
const Toolbar = ({
  
  onAddShape,
  selectedId,
  selectedIds = [],
  
  
}) => {

  // Saber si hay al menos un elemento seleccionado
  const hasSelection = !!selectedId || selectedIds.length > 0;

  return (
    <div className="border-t border-gray-200 bg-gris-semi-oscuro p-2 flex items-center justify-between sticky bottom-0 w-full">
      
      {/* === Herramientas de creación de figuras === */}
      <div className="flex items-center space-x-2">
        
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

        
      </div>

      {/* === Herramientas de edición de figuras === */}
      <div className="flex items-center space-x-2">
        
      </div>
    </div>
  );
};

export default Toolbar;
