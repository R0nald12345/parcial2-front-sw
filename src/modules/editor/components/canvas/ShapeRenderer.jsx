// ShapeRenderer.jsx
import React, { useEffect, useState } from "react";
import { Rect, Circle, Star, Line, Text, Image, Group } from "react-konva";
import Konva from "konva";

// Este componente renderiza cualquier tipo de figura (forma) que exista en el lienzo
const ShapeRenderer = ({
  shape,            // Objeto con atributos de la figura
  isSelected,       // Si la figura está seleccionada
  onSelect,         // Función para seleccionar una figura
  onUpdate,         // Función para actualizar atributos (posición, tamaño, etc.)
  handleStageClick  // Se usa para volver a activar los eventos del stage
}) => {

  // Al soltar la figura tras arrastrarla, actualizamos su posición
  const handleDragEnd = (e) => {
    onUpdate(shape.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  // Al hacer clic sobre una figura, se selecciona
  const handleClick = (e) => {
    const isBackground = shape.type === "rectangle" && shape.x === 0 && shape.y === 0 && shape.fill && shape.fill.toUpperCase() === "#FFFFFF";
    if (isBackground) return;
    onSelect(shape.id, e.evt.ctrlKey || e.evt.shiftKey); // Soporte multiselección
  };

  // Al terminar una transformación (resize o rotación)
  const handleTransformEnd = (e) => {
    const node = e.target;
    onUpdate(shape.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * node.scaleX()),
      height: Math.max(5, node.height() * node.scaleY()),
      rotation: node.rotation()
    });
    node.scaleX(1); // Resetear escalado
    node.scaleY(1);
  };

  // Props comunes que comparten todas las figuras
  const shapeProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    draggable: shape.draggable,
    rotation: shape.rotation,
    onClick: handleClick,
    onTap: handleClick,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  // Doble clic sobre texto: permite edición directa
  const handleTextDblClick = (e) => {
    const textNode = e.target;
    const stage = textNode.getStage();
    if (!stage) return;

    stage.off('mousedown touchstart');

    const stageBox = stage.container().getBoundingClientRect();
    const textPosition = textNode.absolutePosition();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = shape.text || "Escribe aquí...";
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${shape.width}px`;
    textarea.style.height = `${shape.height}px`;
    textarea.style.fontSize = `${shape.fontSize}px`;
    textarea.style.fontFamily = shape.fontFamily || 'Arial';
    textarea.style.border = '1px solid blue';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.color = shape.fill;

    if (shape.rotation) {
      textarea.style.transform = `rotate(${shape.rotation}deg)`;
      textarea.style.transformOrigin = 'top left';
    }

    textarea.focus();
    textarea.select();

    // Cuando termina la edición del texto
    const finishEditing = () => {
      if (stage) {
        stage.on('mousedown touchstart', handleStageClick);
      }
      onUpdate(shape.id, { text: textarea.value });
      document.body.removeChild(textarea);
    };

    textarea.addEventListener('blur', finishEditing);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        textarea.blur();
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        textarea.value = shape.text || "";
        textarea.blur();
        e.preventDefault();
      }
    });
  };

  // --- NUEVO: Manejo de imagen base64 recibida por sockets ---
  const [imgObj, setImgObj] = useState(null);

  useEffect(() => {
    if (shape.type === "image" && shape.src && !imgObj) {
      const img = new window.Image();
      img.src = shape.src;
      img.onload = () => setImgObj(img);
    }
    // Si shape cambia, reinicia la imagen
    // eslint-disable-next-line
  }, [shape.src]);

  // Render de figuras según el tipo
  switch (shape.type) {
    case "group":
      return (
        <Group {...shapeProps}>
          {shape.children?.map((childShape) => (
            <ShapeRenderer
              key={childShape.id}
              shape={childShape}
              isSelected={false}
              onSelect={onSelect}
              onUpdate={onUpdate}
              handleStageClick={handleStageClick}
            />
          ))}
        </Group>
      );

    case "rectangle":
      return <Rect {...shapeProps} width={shape.width} height={shape.height} />;

    case "circle":
      return <Circle {...shapeProps} radius={shape.width / 2} />;

    case "star":
      return (
        <Star
          {...shapeProps}
          numPoints={5}
          innerRadius={shape.width / 4}
          outerRadius={shape.width / 2}
        />
      );

    case "line":
      return (
        <Line
          {...shapeProps}
          points={[0, 0, shape.width, 0]}
          strokeWidth={shape.strokeWidth || 2}
        />
      );

    case "triangle":
      return (
        <Line
          {...shapeProps}
          points={[
            shape.width / 2, 0,
            0, shape.height,
            shape.width, shape.height,
            shape.width / 2, 0
          ]}
          closed={true}
        />
      );

    case "text":
      return (
        <Text
          {...shapeProps}
          text={shape.text || "Doble clic para editar"}
          fontSize={shape.fontSize || 24}
          fontFamily={shape.fontFamily || "Arial"}
          width={shape.width}
          height={shape.height}
          onDblClick={handleTextDblClick}
        />
      );

    case "image":
      return (
        <Image
          {...shapeProps}
          image={shape.image || imgObj}
          width={shape.width}
          height={shape.height}
        />
      );

    default:
      return null;
  }
};

export default ShapeRenderer;
