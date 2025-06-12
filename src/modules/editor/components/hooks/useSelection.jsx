import React, { useState } from "react";

// Este hook personalizado permite seleccionar múltiples figuras en el canvas
// usando un rectángulo de selección (como en programas de diseño)

// Recibe:
// - onDeselectShape: función para deseleccionar todas las figuras
// - onCanvasClick: función que maneja clics sobre el canvas
// - onSelectShapesInArea: función que selecciona figuras dentro de un área

export const useSelection = ({
  onDeselectShape,
  onCanvasClick,
  onSelectShapesInArea
}) => {
  const [isSelecting, setIsSelecting] = useState(false); // ¿Está arrastrando para seleccionar?
  const [selectionArea, setSelectionArea] = useState({
    x1: 0, y1: 0, x2: 0, y2: 0
  }); // Coordenadas del área de selección

  // Cuando presionas el mouse sobre el canvas
  const handleMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      const pos = e.target.getStage().getPointerPosition();
      if (pos) {
        setIsSelecting(true);
        setSelectionArea({
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y
        });
        onDeselectShape(); // Deselecciona si estabas seleccionando antes
      }
    }
    onCanvasClick(e); // Llama al callback adicional
  };

  // Mientras mueves el mouse (dragging)
  const handleMouseMove = (e) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      setSelectionArea(prev => ({
        ...prev,
        x2: pos.x,
        y2: pos.y
      }));
    }
  };

  // Cuando sueltas el mouse (completa la selección)
  const handleMouseUp = (e) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      setSelectionArea(prev => ({
        ...prev,
        x2: pos.x,
        y2: pos.y
      }));

      // Selecciona las figuras dentro del área delimitada
      onSelectShapesInArea(selectionArea.x1, selectionArea.y1, pos.x, pos.y);
    }

    setIsSelecting(false); // Termina la selección
  };

  return {
    isSelecting,
    selectionArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
