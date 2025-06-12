import React, { useState, useCallback } from 'react';
// import { ShapeAttributes } from '../../types/ShapeAttributes.jsx';
// import { createShape } from '../services/shapeFactory.js';
import { useLayering } from './useLayering.jsx';
import { socket } from '../../ServidorSockets/socket.js'; // Asegúrate de tener un archivo con socket ya conectado
import { createShape } from '../../service/ShapeFactory.js';
import { ShapeAttributes } from '../../types/ShapeAttributes.jsx';
// import { ShapeAttributes } from '../../types/ShapeAttributes.jsx';

export const useShapes = () => {
    const [shapes, setShapes] = useState([]); // Lista de todas las figuras
    const [selectedId, setSelectedId] = useState(null); // ID de figura seleccionada
    const [selectedIds, setSelectedIds] = useState([]); // IDs para selección múltiple
    const [isTextMode, setIsTextMode] = useState(false); // Modo texto activado

    // Funciones para subir/bajar capas
    const { moveForward, moveBackward } = useLayering({ shapes, setShapes });

    // Calcular límites de un grupo
    const getGroupBounds = (shapes) => {
        if (shapes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        shapes.forEach(shape => {
            minX = Math.min(minX, shape.x);
            minY = Math.min(minY, shape.y);
            maxX = Math.max(maxX, shape.x + shape.width);
            maxY = Math.max(maxY, shape.y + shape.height);
        });

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };

    // Crea una nueva figura
    const addShape = useCallback((type, xOrAttrs, y = 100) => {
        let newShape;

        if (typeof xOrAttrs === 'object' && xOrAttrs !== null && type === "image") {
            const attrs = xOrAttrs;
            newShape = new ShapeAttributes({
                type: 'image',
                x: attrs.x || 100,
                y: attrs.y || 100,
                width: attrs.width || 100,
                height: attrs.height || 100,
                image: attrs.image,
                src: attrs.src,
                draggable: true,
                rotation: attrs.rotation || 0,
                zIndex: shapes.length,
            });
        } else if (type === "text") {
            const x = typeof xOrAttrs === 'number' ? xOrAttrs : 100;
            newShape = new ShapeAttributes({
                type: "text",
                x, y,
                fill: "#FFFF00",
                width: 200,
                height: 50,
                draggable: true,
                fontSize: 24,
                fontFamily: "Arial",
                zIndex: shapes.length,
            });
        } else {
            const x = typeof xOrAttrs === 'number' ? xOrAttrs : 100;
            newShape = createShape(type);
            newShape.x = x;
            newShape.y = y;
            newShape.zIndex = shapes.length;
        }

        setShapes(prev => [...prev, newShape]);
        setSelectedId(newShape.id);
        setSelectedIds([newShape.id]);

        // 🔌 Emitir al servidor para que otros usuarios lo reciban
        socket.emit("new_shape", newShape);
    }, [shapes]);

    // Actualiza una figura existente
    const updateShape = useCallback((id, newAttrs) => {
        setShapes(prev =>
            prev.map(shape => shape.id === id ? shape.cloneWith(newAttrs) : shape)
        );

        // 🔌 Notificar a otros usuarios que se actualizó esta figura
        socket.emit("update_shape", { id, newAttrs });
    }, [shapes]);

    // Selección simple o múltiple
    const selectShape = useCallback((id, isMultiSelect = false) => {
        if (isMultiSelect) {
            setSelectedIds(prevIds =>
                prevIds.includes(id)
                    ? prevIds.filter(shapeId => shapeId !== id)
                    : [...prevIds, id]
            );
        } else {
            setSelectedId(id);
            setSelectedIds([id]);
        }
    }, []);

    // Agrupar varias figuras
    const groupShapes = useCallback((shapeIds) => {
        if (shapeIds.length < 2) return;

        const shapesToGroup = shapes.filter(shape => shapeIds.includes(shape.id));
        const groupBounds = getGroupBounds(shapesToGroup);

        const groupShape = new ShapeAttributes({
            type: 'group',
            id: `group-${Date.now()}`,
            ...groupBounds,
            children: shapesToGroup,
            isGroup: true,
            draggable: true
        });

        setShapes(prev =>
            prev.filter(shape => !shapeIds.includes(shape.id)).concat(groupShape)
        );
        setSelectedId(groupShape.id);
        setSelectedIds([]);

        // 🔌 Emitir grupo a otros clientes
        socket.emit("group_shapes", {
            groupShape,
            groupedIds: shapeIds
        });
    }, [shapes]);

    // Desagrupa un grupo
    const ungroupShapes = useCallback((groupId) => {
        const group = shapes.find(shape => shape.id === groupId);
        if (!group?.children || !Array.isArray(group.children)) return;

        setShapes(prev =>
            prev.filter(shape => shape.id !== groupId).concat(group.children)
        );
        setSelectedId(null);
        setSelectedIds([]);

        // 🔌 Emitir desagrupación
        socket.emit("ungroup_shapes", {
            groupId,
            children: group.children
        });
    }, [shapes]);

    // Selección por área (drag box)
    const selectShapesInArea = useCallback((x1, y1, x2, y2) => {
        const selectedShapes = shapes.filter(shape =>
            shape.x >= Math.min(x1, x2) &&
            shape.x + shape.width <= Math.max(x1, x2) &&
            shape.y >= Math.min(y1, y2) &&
            shape.y + shape.height <= Math.max(y1, y2)
        );
        setSelectedIds(selectedShapes.map(shape => shape.id));
    }, [shapes]);

    return {
        shapes,
        selectedId,
        selectedIds,
        isTextMode,
        setIsTextMode,
        addShape,
        selectShapesInArea,
        updateShape,
        selectShape,
        deselectShape: () => {
            setSelectedId(null);
            setSelectedIds([]);
        },
        deleteShape: useCallback((id) => {
            setShapes(prev => prev.filter(shape => shape.id !== id));
            if (selectedId === id) {
                setSelectedId(null);
                setSelectedIds([]);
            }
            // 🔌 Emitir eliminación
            socket.emit("delete_shape", id);
        }, [shapes, selectedId]),
        moveForward,
        moveBackward,
        groupShapes,
        ungroupShapes,
        handleCanvasClick: useCallback((e) => {
            if (isTextMode && e.target === e.target.getStage()) {
                const pos = e.target.getPointerPosition();
                addShape("text", pos.x, pos.y);
            } else if (e.target === e.target.getStage()) {
                setSelectedId(null);
                setSelectedIds([]);
            }
        }, [isTextMode, addShape]),
        setShapes,
        setSelectedId,
        setSelectedIds
    };
};
