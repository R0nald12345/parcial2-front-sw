import { useRef, useEffect } from "react";
import Konva from "konva";

// Este hook maneja el canvas principal: referencias a Stage, Layer y Transformer.
// También controla la selección y el "deseleccionado" de figuras.

export const useCanvas = ({
  selectedId,   // ID de la figura seleccionada
  onDeselect    // Callback para deseleccionar todo
}) => {
  // Referencias a los elementos de Konva
  const stageRef = useRef(null);         // Stage principal
  const layerRef = useRef(null);         // Capa donde se dibujan las figuras
  const transformerRef = useRef(null);   // Cuadro de transformación (resize, rotación, etc.)

  // Si haces clic en el fondo (el Stage), deseleccionas todas las figuras
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      onDeselect(); // Deselecciona si el clic no fue sobre una figura
    }
  };

  // Cada vez que cambia `selectedId`, actualiza el Transformer
  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      // Busca la figura seleccionada dentro del layer
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);

      if (selectedNode) {
        // Conecta el transformer a la figura seleccionada
        transformerRef.current.attachTo(selectedNode);
        layerRef.current.batchDraw(); // Redibuja para mostrar el cambio
      }
    } else if (transformerRef.current) {
      // Si no hay figura seleccionada, limpia el transformer
      transformerRef.current.detach();
      layerRef.current?.batchDraw();
    }
  }, [selectedId]); // Se ejecuta cuando cambia `selectedId`

  return {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  };
};
