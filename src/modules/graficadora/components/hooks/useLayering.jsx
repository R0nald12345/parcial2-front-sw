import React from "react";
import { useCallback } from "react";
import { ShapeAttributes } from "../../types/ShapeAttributes.jsx";
import { socket } from '../../ServidorSockets/socket.js';

// Este hook controla el orden de capas (zIndex) en tiempo real

export const useLayering = ({ shapes, setShapes }) => {

  const moveForward = useCallback((id) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex < shapes.length - 1) {
      const newShapes = [...shapes];

      [newShapes[shapeIndex], newShapes[shapeIndex + 1]] =
        [newShapes[shapeIndex + 1], newShapes[shapeIndex]];

      newShapes[shapeIndex].zIndex = shapeIndex;
      newShapes[shapeIndex + 1].zIndex = shapeIndex + 1;

      setShapes(newShapes);

      // 🔌 Notificar a otros clientes del nuevo orden
      socket.emit('reorder_shapes', newShapes);
    }
  }, [shapes, setShapes]);

  const moveBackward = useCallback((id) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex > 0) {
      const newShapes = [...shapes];

      [newShapes[shapeIndex], newShapes[shapeIndex - 1]] =
        [newShapes[shapeIndex - 1], newShapes[shapeIndex]];

      newShapes[shapeIndex].zIndex = shapeIndex;
      newShapes[shapeIndex - 1].zIndex = shapeIndex - 1;

      setShapes(newShapes);

      socket.emit('reorder_shapes', newShapes);
    }
  }, [shapes, setShapes]);

  const bringToFront = useCallback((id) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex < shapes.length - 1) {
      const shape = shapes[shapeIndex];
      const otherShapes = shapes.filter((_, idx) => idx !== shapeIndex);

      const newShapes = [...otherShapes, shape];

      const updatedShapes = newShapes.map((shape, idx) =>
        new ShapeAttributes({
          ...shape,
          zIndex: idx
        })
      );

      setShapes(updatedShapes);

      socket.emit('reorder_shapes', updatedShapes);
    }
  }, [shapes, setShapes]);

  const sendToBack = useCallback((id) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex > 0) {
      const shape = shapes[shapeIndex];
      const otherShapes = shapes.filter((_, idx) => idx !== shapeIndex);

      const newShapes = [shape, ...otherShapes];

      const updatedShapes = newShapes.map((shape, idx) =>
        new ShapeAttributes({
          ...shape,
          zIndex: idx
        })
      );

      setShapes(updatedShapes);

      socket.emit('reorder_shapes', updatedShapes);
    }
  }, [shapes, setShapes]);

  return {
    moveForward,
    moveBackward,
    bringToFront,
    sendToBack
  };
};
