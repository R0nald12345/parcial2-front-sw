import React from 'react';
import { ShapeAttributes } from '../../types/ShapeAttributes'; // Asegúrate de que esto sea JS si ya lo convertiste
import { Trash2, Copy, RotateCw, MoveUp, MoveDown } from 'lucide-react';
// Este componente muestra los detalles de la figura seleccionada
// y permite modificar sus atributos desde una barra lateral

const SidebarDetalles = ({ 
    selectedShape, 
    onUpdateShape,
    onDeleteShape,
    onDuplicateShape,
    onRotateShape,
    onMoveForward,
    onMoveBackward,
}) => {
  // Si no hay figura seleccionada, muestra un mensaje
  if (!selectedShape) {
    return (
      <div className="p-4 bg-gris-semi-oscuro h-full">
        <h2 className="text-lg font-semibold mb-4">Detalles</h2>
        <p className="text-gray-500">Selecciona una figura para editar sus propiedades</p>
      </div>
    );
  }

  // Esta función maneja los cambios de cualquier propiedad editable
  const handleChange = (property, value) => {
    // Llama a onUpdateShape para que el hook o componente padre actualice la figura
    onUpdateShape(selectedShape.id, { [property]: value });
  };

  return (
    <div className="p-4  h-full overflow-y-scroll">
      <div className="mb-4">
        <h2 className="text-lg text-white font-semibold mb-2">Acciones</h2>
        <div className="flex items-center space-x-2">
            <button className="p-2 rounded hover:bg-gray-100 text-red-500" onClick={onDeleteShape} title="Eliminar">
                <Trash2 size={20} />
            </button>
            <button className="p-2 rounded hover:bg-gray-100" onClick={onDuplicateShape} title="Duplicar">
                <Copy size={20} />
            </button>
            <button className="p-2 rounded hover:bg-gray-100" onClick={onRotateShape} title="Rotar">
                <RotateCw size={20} />
            </button>
            <button className="p-2 rounded hover:bg-gray-100 text-white hover:text-black" onClick={onMoveForward} title="Traer al frente">
                <MoveUp size={20} />
            </button>
            <button className="p-2 rounded hover:bg-gray-100 text-white hover:text-black" onClick={onMoveBackward} title="Enviar al fondo">
                <MoveDown size={20} />
            </button>
        </div>
      </div>
      {/* Solo para figuras de texto */}
      {selectedShape.type === 'text' && (
        <>
          <div className="mb-4">
            <label className="block text-sm text-white font-medium mb-1">Tamaño de la Fuente</label>
            <input
              type="number"
              value={selectedShape.fontSize || 24}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-white font-medium mb-1">Fuente</label>
            <select
              value={selectedShape.fontFamily || 'Arial'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-white font-medium mb-1">Texto</label>
            <textarea
              value={selectedShape.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
        </>
      )}

      {/* Atributos generales de cualquier figura */}
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-1">Color de Relleno</label>
        <input
          type="color"
          value={selectedShape.fill}
          onChange={(e) => handleChange('fill', e.target.value)}
          className="w-full h-10"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Color del Borde</label>
        <input
          type="color"
          value={selectedShape.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
          className="w-full h-10"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Grosor del Borde</label>
        <input
          type="number"
          value={selectedShape.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          min="0"
        />
      </div>

      <h2 className="text-lg text-white font-semibold mb-4">Detalles de la Figura</h2>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Tipo</label>
        <input
          type="text"
          value={selectedShape.type}
          disabled
          className="w-full px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Posición X</label>
        <input
          type="number"
          value={selectedShape.x}
          onChange={(e) => handleChange('x', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Posición Y</label>
        <input
          type="number"
          value={selectedShape.y}
          onChange={(e) => handleChange('y', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Ancho</label>
        <input
          type="number"
          value={selectedShape.width}
          onChange={(e) => handleChange('width', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Alto</label>
        <input
          type="number"
          value={selectedShape.height}
          onChange={(e) => handleChange('height', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-white font-medium mb-1">Rotación</label>
        <input
          type="number"
          value={selectedShape.rotation}
          onChange={(e) => handleChange('rotation', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          min="0"
          max="360"
        />
      </div>
    </div>
  );
};

export default SidebarDetalles;
