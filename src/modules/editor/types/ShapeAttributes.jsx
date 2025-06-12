import React from 'react';
// Clase que representa los atributos y comportamiento de una figura (rectángulo, círculo, etc.)
class ShapeAttributes {


  constructor(params) {
    // ID único generado si no se proporciona
    this.id = params.id || `shape-${Date.now()}`;

    // Tipo de figura: 'rect', 'circle', etc.
    this.type = params.type;

    // Posición inicial
    this.x = params.x || 100;
    this.y = params.y || 100;

    // Tamaño inicial
    this.width = params.width || 100;
    this.height = params.height || 100;

    // Estilo
    this.fill = params.fill || "#FFFF00"; // Amarillo por defecto
    this.stroke = params.stroke || "#000000"; // Negro por defecto
    this.strokeWidth = params.strokeWidth || 0;

    // Comportamiento
    this.draggable = params.draggable !== undefined ? params.draggable : true;
    this.rotation = params.rotation || 0;

    // Texto
    this.text = params.text || "";
    this.fontSize = params.fontSize || 24;
    this.fontFamily = params.fontFamily || "Arial";

    // Orden de capa
    this.zIndex = params.zIndex ?? 0;

    // Grupo
    this.children = params.children;
    this.parent = params.parent;
    this.isGroup = params.isGroup;

    // Imagen
    this.image = params.image;
    this.src = params.src;
  }

  // Escala la figura en X e Y
  scale(sx, sy) {
    this.width *= sx;
    this.height *= sy;
    return this;
  }

  // Mueve la figura en X e Y
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  }

  // Rota la figura
  rotate(angle) {
    this.rotation = (this.rotation + angle) % 360;
    return this;
  }

  // Actualiza los estilos visuales
  setStyle(fill, stroke, strokeWidth) {
    if (fill) this.fill = fill;
    if (stroke) this.stroke = stroke;
    if (strokeWidth !== undefined) this.strokeWidth = strokeWidth;
    return this;
  }

  // Clona el objeto con nuevos atributos, si se proporcionan
  cloneWith(newAttrs) {
    return new ShapeAttributes({
      id: newAttrs.id ?? this.id,
      type: newAttrs.type ?? this.type,
      x: newAttrs.x ?? this.x,
      y: newAttrs.y ?? this.y,
      width: newAttrs.width ?? this.width,
      height: newAttrs.height ?? this.height,
      fill: newAttrs.fill ?? this.fill,
      stroke: newAttrs.stroke ?? this.stroke,
      strokeWidth: newAttrs.strokeWidth ?? this.strokeWidth,
      draggable: newAttrs.draggable ?? this.draggable,
      rotation: newAttrs.rotation ?? this.rotation,
      text: newAttrs.text ?? this.text,
      fontSize: newAttrs.fontSize ?? this.fontSize,
      fontFamily: newAttrs.fontFamily ?? this.fontFamily,
      children: newAttrs.children ?? this.children,
      zIndex: newAttrs.zIndex ?? this.zIndex,
      image: newAttrs.image ?? this.image,
      src: newAttrs.src ?? this.src,
    });
  }
}

// Exportación para uso en otros archivos
export { ShapeAttributes };
