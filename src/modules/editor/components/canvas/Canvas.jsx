import React from 'react';
import { useState } from 'react';
import { Layer, Stage, Transformer, Line } from "react-konva";
// import useCanvas  from "../hooks/useCanvas";
// import useContextMenu  from "../hooks/useContextMenu";
import  {useSelection}  from "../hooks/useSelection";
import ShapeRenderer from "./ShapeRenderer";
import ContextMenu from "./ContextMenu";
// import {SelectionRect} from './SelectionRect';
import Konva from 'konva';
import SelectionRect from './SelectionRect';
import { useCanvas } from '../hooks/useCanvas';
import { useContextMenu } from '../hooks/useContextMenu';

const Canvas = ({
  shapes,
  selectedId,
  selectedIds,
  isTextMode,
  onSelectShape,
  onDeselectShape,
  onUpdateShape,
  onAddShape,
  onDeleteShape,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes,
  onCanvasClick
}) => {
  // Estado para escala (zoom) y posición del lienzo (pan)
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Tamaño del área de trabajo
  const [stageSize] = useState({
    width: 5000,
    height: 5000
  });

  // Hook personalizado para manejar referencias y clicks
  const {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  } = useCanvas({
    selectedId,
    shapes,
    onSelect: onSelectShape,
    onDeselect: onDeselectShape
  });

  // Hook de selección por arrastre
  const {
    isSelecting,
    selectionArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useSelection({
    stageRef,
    onDeselectShape,
    onCanvasClick,
    onSelectShapesInArea: (x1, y1, x2, y2) => {
      const isBackground = (shape) =>
        shape.type === "rectangle" &&
        shape.x === 0 && shape.y === 0 &&
        shape.fill && shape.fill.toUpperCase() === "#FFFFFF";
      const selectedShapes = shapes.filter(shape => {
        if (isBackground(shape)) return false;
        const shapeX = shape.x;
        const shapeY = shape.y;
        const shapeWidth = shape.width;
        const shapeHeight = shape.height;

        return (
          shapeX >= Math.min(x1, x2) &&
          shapeX + shapeWidth <= Math.max(x1, x2) &&
          shapeY >= Math.min(y1, y2) &&
          shapeY + shapeHeight <= Math.max(y1, y2)
        );
      });
      selectedShapes.forEach(shape => onSelectShape(shape.id, true));
    }
  });

  // Hook para el menú contextual (click derecho)
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  } = useContextMenu();

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  // Manejador de zoom con la rueda del mouse
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: pointer.x / oldScale - stage.x() / oldScale,
      y: pointer.y / oldScale - stage.y() / oldScale
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // Limita el zoom
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    const newPointer = stage.getPointerPosition();
    if (!newPointer) return;

    const containerWidth = stageSize.width; // o el tamaño real del contenedor visible
    const containerHeight = stageSize.height;

    let newPos = {
      x: -(mousePointTo.x - newPointer.x / newScale) * newScale,
      y: -(mousePointTo.y - newPointer.y / newScale) * newScale
    };

    newPos = clampPosition(newPos, newScale, containerWidth, containerHeight, stageSize.width, stageSize.height);

    setScale(newScale);
    setPosition(newPos);
  };

  function clampPosition(pos, scale, containerWidth, containerHeight, stageWidth, stageHeight) {
    // El área visible del canvas
    const viewWidth = containerWidth / scale;
    const viewHeight = containerHeight / scale;

    // Limita para que no se salga del área de trabajo
    const minX = Math.min(0, containerWidth - stageWidth * scale);
    const minY = Math.min(0, containerHeight - stageHeight * scale);
    const maxX = 0;
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y))
    };
  }

  return (
    <div className="relative w-full h-full overflow-auto">
      <div 
        className="absolute w-full h-full"
        style={{
          width: stageSize.width,
          height: stageSize.height,
          backgroundColor: '#f0f0f0',
          overflow: 'auto'
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          onClick={closeContextMenu}
          onWheel={handleWheel}
          draggable
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          className="shadow-md bg-black"
          style={{ cursor: isTextMode ? 'text' : 'default' }}
        >
          {/* Fondo cuadriculado */}
          <Layer>
            <GridBackground width={stageSize.width} height={stageSize.height} />
          </Layer>

          {/* Capa principal de formas */}
          <Layer ref={layerRef}>
            {shapes.map((shape) => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                isSelected={selectedId === shape.id || selectedIds.includes(shape.id)}
                onSelect={(id, isMultiSelect) => onSelectShape(id, isMultiSelect)}
                onUpdate={onUpdateShape}
                handleStageClick={handleStageClick}
              />
            ))}

            {/* Rectángulo de selección */}
            {isSelecting && (
              <SelectionRect
                x={Math.min(selectionArea.x1, selectionArea.x2)}
                y={Math.min(selectionArea.y1, selectionArea.y2)}
                width={Math.abs(selectionArea.x2 - selectionArea.x1)}
                height={Math.abs(selectionArea.y2 - selectionArea.y1)}
              />
            )}

            {/* Herramienta de transformación */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          </Layer>
        </Stage>

        {/* Menú contextual (click derecho) */}
        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x + (stageRef.current?.container().offsetLeft || 0)}
            y={contextMenu.y + (stageRef.current?.container().offsetTop || 0)}
            selectedId={selectedId}
            selectedIds={selectedIds}
            shapes={shapes}
            onClose={closeContextMenu}
            onMoveForward={onMoveForward}
            onMoveBackward={onMoveBackward}
            onGroupShapes={onGroupShapes}
            onUngroupShapes={onUngroupShapes}
          />
        )}
      </div>
    </div>
  );
};

// 🔳 Fondo de cuadrícula (opcional)
const GridBackground = ({ width, height }) => {
  const gridSize = 20;
  const lines = [];

  for (let i = 0; i < width; i += gridSize) {
    lines.push(<Line key={`v${i}`} points={[i, 0, i, height]} stroke="#ddd" strokeWidth={0.5} />);
  }

  for (let i = 0; i < height; i += gridSize) {
    lines.push(<Line key={`h${i}`} points={[0, i, width, i]} stroke="#ddd" strokeWidth={0.5} />);
  }

  return <>{lines}</>;
};

export default Canvas;
