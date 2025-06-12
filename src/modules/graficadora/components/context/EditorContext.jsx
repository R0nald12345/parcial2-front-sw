// context/EditorContext.jsx
import React, { createContext, useContext } from 'react';
import { useShapes } from '../../hooks/useShapes'; // Hook personalizado donde está toda la lógica de figuras

// Creamos el contexto para que otras partes de la app accedan a los datos del editor
const EditorContext = createContext(undefined);

// Proveedor del contexto. Esto envuelve los componentes hijos para que puedan usar el contexto
export const EditorProvider = ({ children }) => {
  const shapeHook = useShapes(); // Lógica completa de figuras (crear, actualizar, eliminar, seleccionar, etc.)

  // Función para actualizar solo el texto de una figura (se reutiliza updateShape con nuevo texto)
  const updateText = (id, newText) => {
    shapeHook.updateShape(id, { text: newText });
  };

  // Selecciona figuras que están dentro de un área rectangular
  const selectShapesInArea = (x1, y1, x2, y2) => {
    const shapesEnArea = shapeHook.shapes.filter(shape => {
      return (
        shape.x >= Math.min(x1, x2) &&
        shape.x + shape.width <= Math.max(x1, x2) &&
        shape.y >= Math.min(y1, y2) &&
        shape.y + shape.height <= Math.max(y1, y2)
      );
    });

    // Guardamos la selección múltiple en el hook
    shapeHook.setSelectedIds(shapesEnArea.map(shape => shape.id));
  };

  // Retornamos todos los métodos del hook junto con los dos adicionales
  return (
    <EditorContext.Provider value={{
      ...shapeHook,
      updateText,
      selectShapesInArea
    }}>
      {children}
    </EditorContext.Provider>
  );
};
