import { ShapeAttributes } from '../types/ShapeAttributes.jsx'; // Importamos la clase de atributos

// Crea un nuevo grupo a partir de varias figuras
export const createGroupFromShapes = (shapesToGroup) => {
  // Verifica que haya al menos 2 figuras para agrupar
  if (!shapesToGroup || shapesToGroup.length < 2) return null;

  // Encuentra los límites del grupo (mínimo y máximo en X e Y)
  let minX = Math.min(...shapesToGroup.map(s => s.x));
  let minY = Math.min(...shapesToGroup.map(s => s.y));
  let maxX = Math.max(...shapesToGroup.map(s => s.x + s.width));
  let maxY = Math.max(...shapesToGroup.map(s => s.y + s.height));

  // ID único para el grupo
  const groupId = `group-${Date.now()}`;

  // Crea una nueva figura tipo 'group' con hijos
  const newGroup = new ShapeAttributes({
    id: groupId,
    type: 'group',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    fill: 'transparent',     // Sin relleno visible
    stroke: '#00A0FF',       // Azul celeste
    strokeWidth: 1,
    draggable: true,
    rotation: 0,
    // Ajustamos posición relativa de cada hijo al grupo
    children: shapesToGroup.map(shape =>
      shape.cloneWith({
        x: shape.x - minX,
        y: shape.y - minY
      })
    ),
    zIndex: 0 // Se puede ajustar luego
  });

  return newGroup;
};

// Desagrupa: convierte un grupo en sus hijos con coordenadas absolutas
export const unpackGroup = (group) => {
  // Verifica si es un grupo válido
  if (!group || group.type !== 'group' || !group.children) return [];

  // Ajustamos cada hijo a posición absoluta
  return group.children.map(child =>
    child.cloneWith({
      x: group.x + child.x,
      y: group.y + child.y
    })
  );
};

// Verifica si una figura está dentro de un área rectangular (como selección)
export const isShapeInArea = (shape, x1, y1, x2, y2) => {
  // Ordena los límites
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // Verifica que toda la figura esté contenida en ese rectángulo
  return (
    shape.x >= minX &&
    shape.x + shape.width <= maxX &&
    shape.y >= minY &&
    shape.y + shape.height <= maxY
  );
};
