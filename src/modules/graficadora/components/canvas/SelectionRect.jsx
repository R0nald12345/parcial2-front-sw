// components/SelectionRect.jsx
import React from "react";
import { Rect } from "react-konva";

/**
 * Componente visual que renderiza un rectángulo de selección (guía visual) en el canvas.
 * Este rectángulo aparece mientras el usuario está seleccionando múltiples figuras.
 *
 * Props:
 * - x: coordenada X inicial
 * - y: coordenada Y inicial
 * - width: ancho del área seleccionada
 * - height: alto del área seleccionada
 */
const SelectionRect = ({ x, y, width, height }) => {
  return (
    <Rect
      x={x}                          // Posición X del rectángulo
      y={y}                          // Posición Y del rectángulo
      width={width}                 // Ancho del rectángulo
      height={height}               // Alto del rectángulo
      fill="rgba(0, 161, 255, 0.3)" // Color de fondo semitransparente
      stroke="rgb(0, 161, 255)"     // Borde azul claro
      strokeWidth={1}               // Grosor del borde
    />
  );
};

export default SelectionRect;
