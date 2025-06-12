import React from "react";
import { useState } from "react";
import Konva from "konva";

// Este hook maneja la lógica del menú contextual (clic derecho)

export const useContextMenu = () => {
  // Estado del menú contextual
  const [contextMenu, setContextMenu] = useState({
    visible: false, // ¿Está visible?
    x: 0,            // Posición X donde se muestra
    y: 0             // Posición Y donde se muestra
  });

  // Evento de clic derecho (context menu)
  const handleContextMenu = (e) => {
    e.evt.preventDefault(); // Previene el menú por defecto del navegador

    const stage = e.target.getStage(); // Obtiene el stage de Konva
    if (!stage) return;

    const pos = stage.getPointerPosition(); // Coordenadas del mouse
    if (!pos) return;

    // Mostrar el menú en la posición del clic
    setContextMenu({
      visible: true,
      x: pos.x,
      y: pos.y
    });
  };

  // Ocultar el menú contextual
  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
  };

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  };
};
