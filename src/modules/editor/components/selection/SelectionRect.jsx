import React from 'react';
import { Rect } from 'react-konva';

/**
 * Componente visual para mostrar un rectángulo de selección en el canvas.
 * Este rectángulo aparece mientras el usuario está haciendo "drag" para seleccionar múltiples figuras.
 *
 * Props:
 * - isSelecting: booleano que indica si se está realizando una selección.
 * - selectionArea: objeto con coordenadas { x1, y1, x2, y2 } que representan la zona seleccionada.
 */
const SelectionRect = ({ isSelecting, selectionArea }) => {
  if (!isSelecting) return null; // No renderiza nada si no se está seleccionando

  return (
    <Rect
      // Calculamos la esquina superior izquierda y dimensiones del rectángulo
      x={Math.min(selectionArea.x1, selectionArea.x2)}
      y={Math.min(selectionArea.y1, selectionArea.y2)}
      width={Math.abs(selectionArea.x2 - selectionArea.x1)}
      height={Math.abs(selectionArea.y2 - selectionArea.y1)}
      fill="rgba(0, 161, 255, 0.3)"   // Color azul claro semi-transparente
      stroke="#00A1FF"               // Borde azul
      strokeWidth={1}               // Grosor del borde
    />
  );
};

export default SelectionRect;
