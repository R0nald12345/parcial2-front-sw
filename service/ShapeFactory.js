import  {ShapeAttributes}  from "../types/ShapeAttributes"; // Importamos la clase que define figuras

// Crea una nueva figura según el tipo seleccionado (rect, circle, etc.)
export const createShape = (type) => {
  const id = `shape-${Date.now()}`; // ID único basado en timestamp

  // Atributos básicos comunes para todas las figuras
  const baseAttrs = {
    id: id,
    type: type,
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: "#D9D9D9",
    stroke: "#000000",
    strokeWidth: 0,
    draggable: true,
    rotation: 0
  };

  // Según el tipo, se personalizan los atributos
  switch (type) {
    case "rectangle":
      return new ShapeAttributes(baseAttrs);

    case "circle":
      return new ShapeAttributes(baseAttrs);

    case "star":
      return new ShapeAttributes({
        ...baseAttrs,
        fill: "#D9D9D9" // También gris claro, podrías cambiarlo a amarillo si prefieres
      });

    case "line":
      return new ShapeAttributes({
        ...baseAttrs,
        strokeWidth: 2,
        fill: "transparent" // Las líneas no tienen relleno
      });

    case "triangle":
      return new ShapeAttributes({
        ...baseAttrs,
        fill: "#FFFF00", // Amarillo
        width: 100,
        height: 100,
        rotation: 0
      });

    default:
      // Si no se reconoce el tipo, crea un rectángulo por defecto
      return new ShapeAttributes(baseAttrs);
  }
};
