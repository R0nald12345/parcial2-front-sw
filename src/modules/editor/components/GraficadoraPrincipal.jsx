// GraficadoraPrincipal.jsx
import React from "react";
// import { useShapes } from "../hooks/useShapes"; // Hook principal para gestionar figuras (y donde deben estar los sockets)
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import Toolbar from "./toolbar/Toolbar";
import SidebarDetalles from "./sidebar/SidebarDetalles";
import Canvas from "./canvas/Canvas";
import  {ShapeAttributes}  from "../types/ShapeAttributes.jsx"; // Tipo personalizado para las figuras
import { useShapes } from "./hooks/useShapes";

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
          image: img,
          src: e.target?.result,
          draggable: true,
          rotation: 0,
          zIndex: shapes.length,
        });

        // Agregamos la figura a la lista
        setShapes([...shapes, imageShape]);
        setSelectedId(imageShape.id);
        setSelectedIds([imageShape.id]);
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Contenedor principal: 3 columnas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral izquierda */}
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
          />
        </section>

        {/* Área de canvas central */}
        <section className="w-[70%] h-full">
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
        </section>

        {/* Barra lateral derecha: detalles de figura seleccionada */}
        <section className="w-[15%] h-full">
          <SidebarDetalles
            selectedShape={shapes.find(shape => shape.id === selectedId)}
            onUpdateShape={updateShape}
          />
        </section>
      </div>

      {/* Barra de herramientas inferior */}
      <Toolbar
        shapes={shapes}
        onAddShape={addShape}
        selectedId={selectedId}
        selectedIds={selectedIds}
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
        onAddImage={handleAddImage}
      />
    </div>
  );
};

export default GraficadoraPrincipal;
