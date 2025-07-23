import React, { useState, useCallback, useEffect } from 'react';
import { useLayering } from './useLayering.jsx';
import { socket } from '../../ServidorSockets/socket.js'; // Conexión a socket
import { createShape } from '../../service/ShapeFactory.js';
import { ShapeAttributes } from '../../types/ShapeAttributes.jsx';

export const useShapes = () => {
    const [shapes, setShapes] = useState([]); // Lista de figuras en el lienzo
    const [selectedId, setSelectedId] = useState(null); // ID de figura seleccionada
    const [selectedIds, setSelectedIds] = useState([]); // Selección múltiple
    const [isTextMode, setIsTextMode] = useState(false); // Modo texto activado

    // Hooks para control de capas (zIndex)
    const { moveForward, moveBackward } = useLayering({ shapes, setShapes });

    // Calcula el área que ocupa un grupo
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

    // Crea y agrega una nueva figura
    const addShape = useCallback((type, xOrAttrs, y = 100) => {
        let newShape;

        if (typeof xOrAttrs === 'object' && xOrAttrs !== null) {
            // Usa todos los atributos del objeto, pero fuerza un id único y zIndex correcto
            newShape = new ShapeAttributes({
                ...xOrAttrs,
                type,
                id: `shape-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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
                id: `shape-${Date.now()}-${Math.floor(Math.random() * 10000)}`
            });
        } else {
            const x = typeof xOrAttrs === 'number' ? xOrAttrs : 100;
            newShape = createShape(type);
            newShape.x = x;
            newShape.y = y;
            newShape.zIndex = shapes.length;
            newShape.id = `shape-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }

        setShapes(prev => [...prev, newShape]);
        setSelectedId(newShape.id);
        setSelectedIds([newShape.id]);
        socket.emit("new_shape", newShape);
    }, [shapes]);

    // Actualiza atributos de una figura
    const updateShape = useCallback((id, newAttrs) => {
        setShapes(prev =>
            prev.map(shape => shape.id === id ? shape.cloneWith(newAttrs) : shape)
        );
        socket.emit("update_shape", { id, newAttrs });
    }, [shapes]);

    // Selección (simple o múltiple)
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

        socket.emit("group_shapes", {
            groupShape,
            groupedIds: shapeIds
        });
    }, [shapes]);

    // Desagrupar figuras
    const ungroupShapes = useCallback((groupId) => {
        const group = shapes.find(shape => shape.id === groupId);
        if (!group?.children || !Array.isArray(group.children)) return;

        setShapes(prev =>
            prev.filter(shape => shape.id !== groupId).concat(group.children)
        );
        setSelectedId(null);
        setSelectedIds([]);

        socket.emit("ungroup_shapes", {
            groupId,
            children: group.children
        });
    }, [shapes]);

    // Selección por área (arrastre)
    const selectShapesInArea = useCallback((x1, y1, x2, y2) => {
        const selectedShapes = shapes.filter(shape =>
            shape.x >= Math.min(x1, x2) &&
            shape.x + shape.width <= Math.max(x1, x2) &&
            shape.y >= Math.min(y1, y2) &&
            shape.y + shape.height <= Math.max(y1, y2)
        );
        setSelectedIds(selectedShapes.map(shape => shape.id));
    }, [shapes]);

    // Eliminar figura
    const deleteShape = useCallback((id) => {
        setShapes(prev => prev.filter(shape => shape.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
            setSelectedIds([]);
        }
        socket.emit("delete_shape", id);
    }, [shapes, selectedId]);

    // Crear texto al hacer clic si el modo texto está activo
    const handleCanvasClick = useCallback((e) => {
        if (isTextMode && e.target === e.target.getStage()) {
            const pos = e.target.getPointerPosition();
            addShape("text", pos.x, pos.y);
        } else if (e.target === e.target.getStage()) {
            setSelectedId(null);
            setSelectedIds([]);
        }
    }, [isTextMode, addShape]);

    // 🟢 ESCUCHAR EVENTOS ENTRANTES DEL SERVIDOR SOCKET.IO
    useEffect(() => {
        // Alguien agregó una figura
        socket.on("new_shape", (shape) => {
            setShapes((prev) => [...prev, new ShapeAttributes(shape)]);
        });

        // Alguien actualizó una figura
        socket.on("update_shape", ({ id, newAttrs }) => {
            setShapes((prev) =>
                prev.map((shape) =>
                    shape.id === id
                        ? new ShapeAttributes(shape).cloneWith(newAttrs)
                        : shape
                )
            );
        });

        // Alguien eliminó una figura
        socket.on("delete_shape", (id) => {
            setShapes((prev) => prev.filter((shape) => shape.id !== id));
        });

        // Agrupación recibida
        socket.on("group_shapes", ({ groupShape, groupedIds }) => {
            setShapes((prev) =>
                prev
                    .filter((shape) => !groupedIds.includes(shape.id))
                    .concat(new ShapeAttributes(groupShape))
            );
        });

        // Desagrupación recibida
        socket.on("ungroup_shapes", ({ groupId, children }) => {
            setShapes((prev) =>
                prev
                    .filter((shape) => shape.id !== groupId)
                    .concat(children.map((child) => new ShapeAttributes(child)))
            );
        });

        // Reordenamiento recibido
        socket.on("reorder_shapes", (newShapes) => {
            setShapes(newShapes.map((s) => new ShapeAttributes(s)));
        });

        return () => {
            socket.off("new_shape");
            socket.off("update_shape");
            socket.off("delete_shape");
            socket.off("group_shapes");
            socket.off("ungroup_shapes");
            socket.off("reorder_shapes");
        };
    }, []);

    // Exportamos funciones y estados del hook
    return {
        shapes,
        selectedId,
        selectedIds,
        isTextMode,
        setIsTextMode,
        addShape,
        updateShape,
        deleteShape,
        selectShape,
        deselectShape: () => {
            setSelectedId(null);
            setSelectedIds([]);
        },
        moveForward,
        moveBackward,
        groupShapes,
        ungroupShapes,
        selectShapesInArea,
        handleCanvasClick,
        setShapes,
        setSelectedId,
        setSelectedIds
    };
};
