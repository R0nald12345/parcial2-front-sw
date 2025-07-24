// GraficadoraPrincipal.jsx
import React from "react";
// import { useShapes } from "../hooks/useShapes"; // Hook principal para gestionar figuras (y donde deben estar los sockets)
import SidebarGraficadora from "../components/sidebar/SidebarGraficadora.jsx";
import Toolbar from "../components/toolbar/Toolbar.jsx";
import SidebarDetalles from "../components/sidebar/SidebarDetalles.jsx";
import Canvas from "../components/canvas/Canvas.jsx";
import { ShapeAttributes } from "../types/ShapeAttributes.jsx"; // Tipo personalizado para las figuras
import { useShapes } from "../components/hooks/useShapes.jsx";
import ChatGemini from "../components/chatGemini/ChatGemini.jsx";

const GraficadoraPrincipal = () => {
  // Usamos el hook que maneja toda la lógica de figuras y selección
  const {
    shapes,
    selectedId,
    isTextMode,
    addShape,
    updateShape,
    selectShape,
    deselectShape,
    deleteShape,
    handleCanvasClick,
    selectedIds,
    selectShapesInArea,
    moveForward,
    moveBackward,
    groupShapes,
    ungroupShapes,
    setShapes,
    setSelectedId,
    setSelectedIds
  } = useShapes();

  // Manejar subida de imágenes (imagen se transforma en una figura de tipo 'image')
  const handleAddImage = async (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result;

      img.onload = () => {
        // Creamos la figura de tipo imagen
        const imageShape = new ShapeAttributes({
          type: 'image',
          x: 100,
          y: 100,
          width: img.width,
          height: img.height,
          src: e.target?.result, // ✅ Solo esto
          draggable: true,
          rotation: 0,
          zIndex: shapes.length,
        });

        // Agregamos la figura a la lista
        addShape('image', imageShape);
        setSelectedId(imageShape.id);
        setSelectedIds([imageShape.id]);
      };
    };

    reader.readAsDataURL(file);
  };

  // Función para insertar shapes generados por la IA
  // Si agregas un nuevo grupo de figuras generadas por Gemini:
  const handleGeneratedShapes = (shapesFromAI) => {
    const newShapes = shapesFromAI.map(attrs => {
      const clean = { ...attrs };

      // 🚫 Eliminar relaciones de agrupación si existen
      delete clean.parent;
      delete clean.isGroup;
      delete clean.children;

      clean.id = `shape-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      return new ShapeAttributes(clean);
    });

    // Detectar fondo y ordenarlo primero
    const fondo = newShapes.find(s => s.type === 'rectangle' && s.width > 300 && s.height > 300);
    const otros = newShapes.filter(s => s !== fondo);
    const ordenados = fondo ? [fondo, ...otros] : newShapes;

    // Agregar cada figura usando addShape (esto emite el socket)
    ordenados.forEach(shapeAttrs => {
      addShape(shapeAttrs.type, shapeAttrs);
    });
  };



  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Cuerpo principal */}
      <div className="flex flex-1 overflow-hidden">

        {/* Izquierda */}
        <section className="w-[15%] h-full">

          <SidebarGraficadora
            onToolSelect={addShape}
            shapes={shapes}
            selectedId={selectedId}
            onSelectShape={selectShape}
            onDeleteShape={deleteShape}
            onMoveForward={moveForward}
            onMoveBackward={moveBackward}
            onGroupShapes={groupShapes}
            onUngroupShapes={ungroupShapes}
            onAddImage={handleAddImage}
          />

        </section>

        {/* Canvas PIZARRA */}
        <section className="w-[70%] h-full">
          <div className="w-full h-[80%]">
            <Canvas
              shapes={shapes}
              selectedId={selectedId}
              selectedIds={selectedIds}
              isTextMode={isTextMode}
              onSelectShape={selectShape}
              onDeselectShape={deselectShape}
              onUpdateShape={updateShape}
              onAddShape={addShape}
              onDeleteShape={deleteShape}
              onMoveForward={moveForward}
              onMoveBackward={moveBackward}
              onGroupShapes={groupShapes}
              onUngroupShapes={ungroupShapes}
              onCanvasClick={handleCanvasClick}
            />


          </div>


          <div className="w-full h-[80%]">
            <ChatGemini onGenerateShapes={handleGeneratedShapes} />


          </div>


        </section>


        {/* Detalles */}
        <section className="w-[15%] h-full">

          <SidebarDetalles
            selectedShape={shapes.find(shape => shape.id === selectedId)}
            onUpdateShape={updateShape}
            onDeleteShape={() => selectedId && deleteShape(selectedId)}
            onDuplicateShape={() => {
              if (selectedId) {
                const shapeToCopy = shapes.find(shape => shape.id === selectedId);
                if (shapeToCopy) {
                  addShape(shapeToCopy.type);
                }
              }
            }}
            onRotateShape={() => {
              if (selectedId) {
                const shape = shapes.find(shape => shape.id === selectedId);
                if (shape) {
                  updateShape(selectedId, { rotation: (shape.rotation + 90) % 360 });
                }
              }
            }}
            onMoveForward={() => selectedId && moveForward(selectedId)}
            onMoveBackward={() => selectedId && moveBackward(selectedId)}
          />

        </section>


      </div>



    </div>
  );
};

export default GraficadoraPrincipal;