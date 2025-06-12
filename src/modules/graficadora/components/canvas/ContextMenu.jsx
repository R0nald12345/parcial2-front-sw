
import React from 'react';

// ContextMenu.jsx
const ContextMenu = ({
  x,
  y,
  selectedId,
  selectedIds,
  shapes,
  onClose,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes
}) => {
  // Verifica si la forma seleccionada es un grupo
  const isGroup = selectedId && shapes.find(s => s.id === selectedId)?.type === 'group';

  return (
    <div
      className="absolute bg-white shadow-lg rounded-md z-50"
      style={{ left: x, top: y }} // Posición basada en el clic derecho
    >
      <ul className="py-2">
        {/* Opciones si hay una figura seleccionada */}
        {selectedId && (
          <>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => {
                onMoveForward(selectedId);  // Mover figura al frente
                onClose();                  // Cerrar menú
              }}
            >
              Traer al frente
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => {
                onMoveBackward(selectedId); // Enviar figura al fondo
                onClose();
              }}
            >
              Enviar al fondo
            </li>
            <li className="border-t my-1"></li> {/* Separador visual */}
          </>
        )}

        {/* Opción de agrupar si hay múltiples seleccionadas */}
        {selectedIds.length > 1 && (
          <li 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
            onClick={() => {
              onGroupShapes(selectedIds); // Agrupar múltiples figuras
              onClose();
            }}
          >
            Agrupar
          </li>
        )}

        {/* Opción de desagrupar si la figura seleccionada es un grupo */}
        {isGroup && (
          <li 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
            onClick={() => {
              onUngroupShapes(selectedId); // Desagrupar el grupo
              onClose();
            }}
          >
            Desagrupar
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;
