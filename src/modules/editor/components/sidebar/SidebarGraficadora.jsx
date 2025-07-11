// SidebarGraficadora.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Square, Circle, Star, Minus,
  MoveUp, MoveDown, Layers, Trash2, Group, Ungroup 
} from 'lucide-react';
import { IoTriangleOutline } from "react-icons/io5";
import { TfiText } from "react-icons/tfi";

// Este componente representa la barra lateral izquierda del editor
// Aquí se encuentran las herramientas, capas, y acciones para agrupar, eliminar o reordenar figuras
const SidebarGraficadora = ({
  onToolSelect,
  shapes = [],
  selectedId,
  onSelectShape,
  onDeleteShape,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedShapeIds, setSelectedShapeIds] = useState([]);

  // Alternar si un grupo está expandido (mostrar sus hijos o no)
  const toggleGroup = (groupId) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  // Manejo de selección de figura (simple o múltiple con Ctrl/Cmd)
  const handleShapeSelect = (id, event) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedShapeIds(prev =>
        prev.includes(id) ? prev.filter(shapeId => shapeId !== id) : [...prev, id]
      );
    } else {
      setSelectedShapeIds([]);
      onSelectShape(id);
    }
  };

  // Retorna el icono correspondiente al tipo de figura
  const getShapeIcon = (type) => {
    switch (type) {
      case 'rectangle': return <Square size={16} />;
      case 'circle': return <Circle size={16} />;
      case 'star': return <Star size={16} />;
      case 'line': return <Minus size={16} />;
      case 'triangle': return <IoTriangleOutline size={16} />;
      case 'text': return <TfiText size={16} />;
      case 'group': return <Layers size={16} />;
      default: return <Square size={16} />;
    }
  };

  // Renderizado recursivo de lista de figuras, incluyendo agrupaciones
  const renderShapeList = (shapeList = [], isInGroup = false) => {
    return shapeList.map((shape) => {
      const isSelected = selectedId === shape.id || selectedShapeIds.includes(shape.id);
      const isGroup = shape.type === 'group';
      const isExpanded = expandedGroups.has(shape.id);

      return (
        <div key={shape.id} className={`pl-${isInGroup ? '4' : '0'} `}>
          <div
            className={`flex items-center p-2 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-900'} rounded cursor-pointer`}
            onClick={(e) => handleShapeSelect(shape.id, e)}
          >
            {isGroup && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleGroup(shape.id); }}
                className="mr-1 focus:outline-none"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="flex items-center">
              {getShapeIcon(shape.type)}
              <span className="ml-2 text-white">{shape.type} {shape.id.slice(-4)}</span>
            </span>
            <div className="ml-auto flex">
              <button title="Traer adelante" onClick={(e) => { e.stopPropagation(); onMoveForward(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <MoveUp size={14} />
              </button>
              <button title="Enviar atrás" onClick={(e) => { e.stopPropagation(); onMoveBackward(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <MoveDown size={14} />
              </button>
              <button title="Eliminar" onClick={(e) => { e.stopPropagation(); onDeleteShape(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Mostrar hijos si es grupo y está expandido */}
          {isGroup && isExpanded && Array.isArray(shape.children) && shape.children.length > 0 && (
            <div className="ml-4 border-l border-gray-600">
              {renderShapeList(shape.children, true)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4 bg-gris-semi-oscuro h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Nombre del Proyecto</h2>

      {/* Herramientas de dibujo */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-medium mb-2">Herramientas</h3>
        <div className="grid grid-cols-3 gap-2">
          {['rectangle', 'circle', 'star', 'triangle', 'line', 'text'].map(type => (
            <button
              key={type}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
              onClick={() => onToolSelect(type)}
              title={type}
            >
              {getShapeIcon(type)}
              <span className="text-xs mt-1">{type.slice(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agrupar/Desagrupar */}
      <div className="mb-4 flex space-x-2">
        <button
          className={`p-2 ${selectedShapeIds.length > 1 ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
          onClick={() => {
            if (selectedShapeIds.length > 1) {
              onGroupShapes(selectedShapeIds);
              setSelectedShapeIds([]);
            }
          }}
          disabled={selectedShapeIds.length <= 1}
          title="Agrupar"
        >
          <Group size={16} /><span className="ml-1">Agrupar</span>
        </button>

        <button
          className={`p-2 ${selectedId && shapes.find(s => s.id === selectedId)?.type === 'group' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
          onClick={() => {
            const shape = shapes.find(s => s.id === selectedId);
            if (shape?.type === 'group') onUngroupShapes(selectedId);
          }}
          disabled={!selectedId || shapes.find(s => s.id === selectedId)?.type !== 'group'}
          title="Desagrupar"
        >
          <Ungroup size={16} /><span className="ml-1">Desagrupar</span>
        </button>
      </div>

      {/* Lista de capas */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-white text-sm font-medium mb-2">Capas</h3>
        <div className="space-y-1">
          {shapes.length > 0 ? renderShapeList(shapes) : (
            <p className="text-gray-400 text-sm">No hay figuras en el lienzo</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarGraficadora;
