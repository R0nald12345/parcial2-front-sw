// SidebarGraficadora.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Square, Circle, Star, Minus,
  MoveUp, MoveDown, Layers, Trash2, Group, Ungroup, Download, Image as ImageIcon
} from 'lucide-react';
import { IoTriangleOutline } from "react-icons/io5";
import { TfiText } from "react-icons/tfi";
import { FlutterExporter } from '../../types/FlutterExporter';

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
  onUngroupShapes,
  onAddImage
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedShapeIds, setSelectedShapeIds] = useState([]);


  const handleExport = async () => {
    try {
      const exporter = new FlutterExporter('my_flutter_project');
      await exporter.exportToFlutter(shapes);
    } catch (error) {
      console.error('Error al exportar a Flutter:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && onAddImage) {
      onAddImage(file);
    }
  };
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

  const loginModern = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Card central
    { type: "rectangle", x: 32, y: 180, width: 311, height: 370, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    // Título
    { type: "text", x: 60, y: 210, text: "Iniciar Sesión", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 250, height: 40 },
    // Input Email
    { type: "rectangle", x: 60, y: 270, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 282, text: "Correo electrónico", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Input Password
    { type: "rectangle", x: 60, y: 330, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 342, text: "Contraseña", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Botón
    { type: "rectangle", x: 60, y: 400, width: 255, height: 48, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 140, y: 414, text: "Entrar", fontSize: 18, fill: "#FFFFFF", fontFamily: "Arial", width: 100, height: 24 },
    // Link Olvidaste tu contraseña
    { type: "text", x: 120, y: 470, text: "¿Olvidaste tu contraseña?", fontSize: 14, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 20 }
  ];

  const dashboardSimple = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Barra superior
    { type: "rectangle", x: 0, y: 0, width: 375, height: 70, fill: "#1976D2" },
    { type: "text", x: 24, y: 24, text: "Dashboard", fontSize: 24, fill: "#FFFFFF", fontFamily: "Arial", width: 200, height: 30 },
    // Card 1
    { type: "rectangle", x: 24, y: 100, width: 327, height: 120, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    { type: "text", x: 40, y: 120, text: "Bienvenido 👋", fontSize: 20, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    { type: "text", x: 40, y: 150, text: "Este es tu panel principal.", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 24 },
    // Card 2
    { type: "rectangle", x: 24, y: 240, width: 327, height: 120, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    { type: "text", x: 40, y: 260, text: "Tareas", fontSize: 18, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    { type: "text", x: 40, y: 290, text: "No tienes tareas pendientes.", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 24 }
  ];

  const signupModern = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Card central
    { type: "rectangle", x: 32, y: 120, width: 311, height: 500, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    // Título
    { type: "text", x: 60, y: 150, text: "Crear Cuenta", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 250, height: 40 },
    // Input Nombre
    { type: "rectangle", x: 60, y: 210, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 222, text: "Nombre completo", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Input Email
    { type: "rectangle", x: 60, y: 270, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 282, text: "Correo electrónico", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Input Password
    { type: "rectangle", x: 60, y: 330, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 342, text: "Contraseña", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Input Confirmar Password
    { type: "rectangle", x: 60, y: 390, width: 255, height: 44, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 70, y: 402, text: "Confirmar contraseña", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 20 },
    // Botón
    { type: "rectangle", x: 60, y: 460, width: 255, height: 48, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 120, y: 474, text: "Registrarse", fontSize: 18, fill: "#FFFFFF", fontFamily: "Arial", width: 150, height: 24 },
    // Link ya tienes cuenta
    { type: "text", x: 100, y: 520, text: "¿Ya tienes cuenta? Inicia sesión", fontSize: 14, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 20 }
  ];

  const userProfile = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Header
    { type: "rectangle", x: 0, y: 0, width: 375, height: 180, fill: "#1976D2" },
    // Avatar (círculo)
    { type: "circle", x: 137, y: 60, width: 100, height: 100, fill: "#FFFFFF", stroke: "#B0B8C1", strokeWidth: 2 },
    // Nombre
    { type: "text", x: 100, y: 180, text: "Nombre de Usuario", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    // Email
    { type: "text", x: 100, y: 210, text: "usuario@email.com", fontSize: 16, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 24 },
    // Botón Editar
    { type: "rectangle", x: 120, y: 260, width: 135, height: 40, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 150, y: 270, text: "Editar Perfil", fontSize: 16, fill: "#FFFFFF", fontFamily: "Arial", width: 100, height: 24 }
  ];

  const cardList = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Título
    { type: "text", x: 24, y: 24, text: "Mis Elementos", fontSize: 24, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    // Card 1
    { type: "rectangle", x: 24, y: 80, width: 327, height: 80, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    { type: "text", x: 40, y: 100, text: "Elemento 1", fontSize: 18, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    { type: "text", x: 40, y: 130, text: "Descripción corta...", fontSize: 14, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 24 },
    // Card 2
    { type: "rectangle", x: 24, y: 180, width: 327, height: 80, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    { type: "text", x: 40, y: 200, text: "Elemento 2", fontSize: 18, fill: "#1976D2", fontFamily: "Arial", width: 200, height: 30 },
    { type: "text", x: 40, y: 230, text: "Otra descripción...", fontSize: 14, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 24 }
  ];

  const splashScreen = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#1976D2" },
    // Logo (círculo)
    { type: "circle", x: 137, y: 250, width: 100, height: 100, fill: "#FFFFFF" },
    // Título
    { type: "text", x: 80, y: 380, text: "Mi App Móvil", fontSize: 32, fill: "#FFFFFF", fontFamily: "Arial", width: 250, height: 40 },
    // Subtítulo
    { type: "text", x: 100, y: 430, text: "¡Bienvenido!", fontSize: 20, fill: "#F3F6FD", fontFamily: "Arial", width: 200, height: 30 }
  ];

  const emptyState = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" },
    // Icono (círculo)
    { type: "circle", x: 137, y: 250, width: 100, height: 100, fill: "#E0E3EB" },
    // Título
    { type: "text", x: 80, y: 380, text: "Sin resultados", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 250, height: 40 },
    // Subtítulo
    { type: "text", x: 100, y: 430, text: "No se encontraron datos.", fontSize: 18, fill: "#7B809A", fontFamily: "Arial", width: 200, height: 30 }
  ];

  const calendarTemplate = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 375, height: 500, fill: "#F3F6FD" },
    // Cabecera
    { type: "rectangle", x: 0, y: 0, width: 375, height: 70, fill: "#1976D2" },
    { type: "text", x: 140, y: 20, text: "Mayo 2024", fontSize: 22, fill: "#FFFFFF", fontFamily: "Arial", width: 120, height: 30 },
    // Botón anterior
    { type: "rectangle", x: 20, y: 20, width: 30, height: 30, fill: "#1565C0" },
    { type: "text", x: 28, y: 25, text: "<", fontSize: 20, fill: "#FFFFFF", fontFamily: "Arial", width: 20, height: 20 },
    // Botón siguiente
    { type: "rectangle", x: 325, y: 20, width: 30, height: 30, fill: "#1565C0" },
    { type: "text", x: 335, y: 25, text: ">", fontSize: 20, fill: "#FFFFFF", fontFamily: "Arial", width: 20, height: 20 },
    // Días de la semana
    { type: "text", x: 30, y: 80, text: "L", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 75, y: 80, text: "M", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 120, y: 80, text: "M", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 165, y: 80, text: "J", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 210, y: 80, text: "V", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 255, y: 80, text: "S", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    { type: "text", x: 300, y: 80, text: "D", fontSize: 16, fill: "#1976D2", fontFamily: "Arial", width: 20, height: 20 },
    // Celdas de días (5 filas x 7 columnas)
    ...Array.from({ length: 5 }).flatMap((_, row) =>
      Array.from({ length: 7 }).map((_, col) => {
        const dayNum = row * 7 + col + 1;
        return [
          { type: "rectangle", x: 20 + col * 45, y: 110 + row * 45, width: 40, height: 40, fill: "#FFFFFF", stroke: "#B0B8C1", strokeWidth: 1 },
          { type: "text", x: 35 + col * 45, y: 120 + row * 45, text: String(dayNum <= 31 ? dayNum : ''), fontSize: 16, fill: "#333333", fontFamily: "Arial", width: 20, height: 20 }
        ];
      })
    ).flat()
  ];

  const templates = {
    login: loginModern,
    dashboard: dashboardSimple,
    signup: signupModern,
    profile: userProfile,
    cards: cardList,
    splash: splashScreen,
    empty: emptyState,
    calendar: calendarTemplate,
    // ...otros
  };

  const handleInsertTemplate = (templateName) => {
    if (templates[templateName]) {
      // Puedes usar onToolSelect o setShapes, según tu lógica
      templates[templateName].forEach(shape => onToolSelect(shape.type, shape));
    }
  };

  return (
    <div className="p-4 bg-gris-semi-oscuro h-full flex flex-col  ">
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

      {/* Plantillas */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2">Plantillas</h3>
        <div className="flex flex-col space-y-2">
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('login')}>Login</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('dashboard')}>Dashboard</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('signup')}>Registro</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('profile')}>Perfil</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('cards')}>Lista de Elementos</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('splash')}>Pantalla de Bienvenida</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('empty')}>Estado Vacío</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('calendar')}>Calendario</button>
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
      <div className="flex items-center space-x-2">
        {/* Subir imagen */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="p-2 rounded text-white hover:bg-gray-100 hover:text-black cursor-pointer flex items-center justify-center" title="Añadir Imagen">
            <ImageIcon size={20} />
          </label>
        </div>
        <button className="export-button text-gray-500 border border-gray-300 hover:bg-white p-1 rounded-2xl" onClick={handleExport} title="Exportar a Flutter">
          <Download size={18} className="flex justify-center mx-auto"/>
          <span>Exportar a Flutter</span>
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
