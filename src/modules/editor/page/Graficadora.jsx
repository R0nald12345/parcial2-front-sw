import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { crearComponentes, obtenerComponentes } from '../api/api_componentes';
import { io } from 'socket.io-client'; 
import { useParams } from 'react-router-dom';
import { ChatGeminIA } from '../components/chatGeminIA';

const socket = io('http://localhost:3000');

const EditorGrapes = () => {
  const id_proyecto = useParams();
  
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // 🆕 Estados para el sistema nativo de páginas
  const [paginas, setPaginas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(null);
  const [historial, setHistorial] = useState([]); // Historial en memoria
  const [indiceHistorial, setIndiceHistorial] = useState(-1);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  
  const editorRef = useRef(null);

  // Cargar componentes existentes
  useEffect(() => {
    setCargando(true);
    console.log("id del proyecto id_board", id_proyecto.id_board);
    const fetchComponentes = async () => {
      const response = await obtenerComponentes();
      console.log("componentes desde la base de datos", response.data);
      const componentesFiltrados = response.data.filter((c) => 
        c.id_proyecto === parseInt(id_proyecto.id_board)
      );
      setComponentes(componentesFiltrados);
      setCargando(false);
    };
    fetchComponentes();
  }, []);

  // 🔹 Preparar datos de páginas desde componentes existentes
  const prepararPaginas = (componentesData) => {
    // Crear páginas agrupadas por algún criterio (ejemplo: tipo o página virtual)
    const paginasPorDefecto = [
      {
        id: 'pagina-principal',
        name: 'Página Principal',
        styles: '',
        component: ''
      }
    ];

    // Si hay componentes guardados, crear páginas dinámicamente
    const paginasExistentes = new Set();
    componentesData.forEach(comp => {
      // Usar una propiedad para agrupar (ejemplo: comp.pagina o crear lógica)
      const paginaId = comp.pagina || 'pagina-principal';
      paginasExistentes.add(paginaId);
    });

    // Agregar páginas adicionales si existen
    Array.from(paginasExistentes).forEach((paginaId, index) => {
      if (paginaId !== 'pagina-principal') {
        paginasPorDefecto.push({
          id: paginaId,
          name: `Página ${index + 1}`,
          styles: '',
          component: ''
        });
      }
    });

    return paginasPorDefecto;
  };

  // 🔹 Funciones de historial (en memoria)
  const guardarEnHistorial = () => {
    if (!editorRef.current) return;

    const estadoActual = {
      timestamp: Date.now(),
      descripcion: `Cambio ${new Date().toLocaleTimeString()}`,
      paginas: editorRef.current.Pages.getAll().map(page => ({
        id: page.getId(),
        name: page.getName(),
        html: editorRef.current.getHtml({ component: page.getMainComponent() }),
        css: editorRef.current.getCss({ component: page.getMainComponent() }),
        components: page.getMainComponent().toJSON()
      })),
      paginaSeleccionada: editorRef.current.Pages.getSelected()?.getId()
    };

    setHistorial(prev => {
      const nuevoHistorial = [...prev];
      // Limitar historial a últimos 20 elementos
      if (nuevoHistorial.length >= 20) {
        nuevoHistorial.shift();
      }
      nuevoHistorial.push(estadoActual);
      return nuevoHistorial;
    });
    
    setIndiceHistorial(prev => Math.min(prev + 1, 19));
    console.log('Estado guardado en historial:', estadoActual);
  };

  // 🔹 Restaurar desde historial
  const restaurarDesdeHistorial = (indice) => {
    if (!historial[indice] || !editorRef.current) return;

    const estado = historial[indice];
    
    // Limpiar páginas actuales
    const paginasActuales = editorRef.current.Pages.getAll();
    paginasActuales.forEach(page => {
      editorRef.current.Pages.remove(page);
    });

    // Restaurar páginas desde historial
    estado.paginas.forEach(paginaData => {
      editorRef.current.Pages.add({
        id: paginaData.id,
        name: paginaData.name,
        component: paginaData.components
      });
    });

    // Seleccionar página que estaba activa
    if (estado.paginaSeleccionada) {
      editorRef.current.Pages.select(estado.paginaSeleccionada);
    }

    setIndiceHistorial(indice);
    actualizarEstadoPaginas();
    console.log('Estado restaurado desde historial:', estado);
  };

  // 🔹 Actualizar estado de páginas en React
  const actualizarEstadoPaginas = () => {
    if (!editorRef.current) return;

    const todasLasPaginas = editorRef.current.Pages.getAll();
    const paginaSeleccionada = editorRef.current.Pages.getSelected();
    
    setPaginas(todasLasPaginas.map(page => ({
      id: page.getId(),
      name: page.getName(),
      instance: page
    })));
    
    setPaginaActual(paginaSeleccionada ? {
      id: paginaSeleccionada.getId(),
      name: paginaSeleccionada.getName(),
      instance: paginaSeleccionada
    } : null);
  };

  // 🔹 Crear nueva página
  const crearNuevaPagina = () => {
    if (!editorRef.current) return;

    const nombre = prompt('Nombre de la nueva página:') || `Página ${Date.now()}`;
    
    const nuevaPagina = editorRef.current.Pages.add({
      name: nombre,
      component: '<div style="padding: 20px; text-align: center;"><h1>Nueva Página</h1><p>Comienza a diseñar aquí...</p></div>'
    });

    // Seleccionar la nueva página
    editorRef.current.Pages.select(nuevaPagina);
    actualizarEstadoPaginas();
    
    // Guardar en historial
    setTimeout(() => guardarEnHistorial(), 500);
  };

  // 🔹 Cambiar página activa
  const cambiarPagina = (paginaId) => {
    if (!editorRef.current) return;
    
    // Guardar estado actual antes de cambiar
    guardarEnHistorial();
    
    // Cambiar página
    editorRef.current.Pages.select(paginaId);
    actualizarEstadoPaginas();
  };

  // 🔹 Eliminar página
  const eliminarPagina = (paginaId) => {
    if (!editorRef.current) return;
    
    const todasLasPaginas = editorRef.current.Pages.getAll();
    if (todasLasPaginas.length <= 1) {
      alert('No puedes eliminar la única página restante');
      return;
    }

    if (confirm('¿Estás seguro de eliminar esta página?')) {
      editorRef.current.Pages.remove(paginaId);
      actualizarEstadoPaginas();
      guardarEnHistorial();
    }
  };

  // Configuración principal del editor
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado con ID:', socket.id);
    });

    if (componentes.length === 0 && cargando === true) return;

    // 🔹 Preparar páginas iniciales
    const paginasIniciales = prepararPaginas(componentes);

    // 🔹 Inicializar editor con sistema nativo de páginas
    const editor = grapesjs.init({
      container: '#editor',
      fromElement: false,
      height: '100vh',
      storageManager: false,
      
      // 🆕 Configuración nativa de páginas
      pageManager: {
        pages: paginasIniciales
      },
      
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section',
            label: '<b>Section</b>',
            attributes: { class: 'gjs-block-section' },
            content: `
              <section style="width:100%; height:400px; background-color:green;">
                <h1>This is a simple title</h1>
                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
              </section>
            `
          },
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>'
          },
          {
            id: 'image',
            label: 'Image',
            select: true,
            content: { type: 'image' },
            activate: true
          }
        ]
      }
    });

    editorRef.current = editor;

    // Bloques adicionales
    editor.BlockManager.add('label', {
      label: 'Label',
      content: '<label>Etiqueta</label>',
      category: 'Basic'
    });

    editor.BlockManager.add('button', {
      label: 'Button',
      content: '<button type="button">Click Me</button>',
      category: 'Basic'
    });

    editor.BlockManager.add('input', {
      label: 'Input',
      content: '<input type="text" placeholder="Type something..." />',
      category: 'Basic'
    });

    // 🔹 Event listeners para páginas nativas
    editor.on('page', () => {
      console.log('Evento de página detectado');
      actualizarEstadoPaginas();
    });

    // Función para agregar componentes
    const onComponentAdd = (component) => {
      if (component.get('type') !== 'textnode') {
        const cid = component.getId();
        const className = `comp-${cid}`;
        component.addClass(className);

        const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        component.addAttributes({ 'data-id-db': tempId });

        const paginaActualId = editor.Pages.getSelected()?.getId();

        const nuevoItem = {
          id: tempId,
          id_proyecto: parseInt(id_proyecto.id_board),
          pagina: paginaActualId, // 🆕 Identificar página
          tipo: component.get('type'),
          datos: component.toJSON({ shallow: false }),
          html: component.toHTML(),
          style: { [`.${className}`]: component.getStyle() },
          creado_en: new Date().toISOString()
        };

        socket.emit('componenteCreado', nuevoItem);
        
        // Guardar en historial después de agregar
        setTimeout(() => guardarEnHistorial(), 1000);
      }
    };

    // Event listener para cambios de estilo
    editor.on('component:styleUpdate', (component) => {
      const clase = component.getClasses()[0];
      if (!clase) return;

      const cssRule = editor.CssComposer.getRule(`.${clase}`);
      const estiloPorClase = cssRule ? cssRule.getStyle() : {};
      const id = component.getAttributes()['data-id-db'];
      const paginaActualId = editor.Pages.getSelected()?.getId();

      const itemActualizado = {
        id,
        id_proyecto: parseInt(id_proyecto.id_board),
        pagina: paginaActualId,
        tipo: component.get('type'),
        datos: component.toJSON({ shallow: false }),
        html: component.toHTML(),
        style: { [`.${clase}`]: estiloPorClase },
        actualizado_en: new Date().toISOString()
      };

      socket.emit('componenteActualizado', itemActualizado);
      
      // Guardar en historial con debounce
      setTimeout(() => guardarEnHistorial(), 2000);
    });

    // Cargar componentes existentes en la página correspondiente
    const componentesDesdeBD = componentes.map(row => ({
      ...row,
      datos: JSON.parse(row.datos),
      style: JSON.parse(row.style)
    }));

    editor.off('component:add', onComponentAdd);

    componentesDesdeBD.forEach(comp => {
      // Cambiar a la página correspondiente antes de agregar componente
      if (comp.pagina) {
        const pagina = editor.Pages.get(comp.pagina);
        if (pagina) {
          editor.Pages.select(pagina);
        }
      }

      editor.addComponents(comp.html);
      const estilos = Object.entries(comp.style).map(([selector, styleObj]) => ({
        selectors: [selector.replace(/^\./, '')],
        style: styleObj
      }));
      editor.addStyle(estilos);
    });

    editor.on('component:add', onComponentAdd);

    // Inicializar estado
    actualizarEstadoPaginas();
    
    // Guardar estado inicial en historial
    setTimeout(() => guardarEnHistorial(), 1000);

    return () => editor.destroy();
  }, [componentes, cargando]);

  return (
    <>
      {/* 🆕 Barra de páginas nativas */}
      <div style={{ 
        padding: '10px', 
        background: '#2c3e50', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Páginas:</span>
          {paginas.map(pagina => (
            <div key={pagina.id} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => cambiarPagina(pagina.id)}
                style={{
                  padding: '5px 15px',
                  background: paginaActual?.id === pagina.id ? '#3498db' : '#34495e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px 0 0 4px',
                  cursor: 'pointer'
                }}
              >
                {pagina.name}
              </button>
              {paginas.length > 1 && (
                <button
                  onClick={() => eliminarPagina(pagina.id)}
                  style={{
                    padding: '5px 8px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={crearNuevaPagina}
            style={{
              padding: '5px 10px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Nueva Página
          </button>
        </div>

        {/* 🆕 Controles de historial en memoria */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            style={{
              padding: '5px 15px',
              background: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {mostrarHistorial ? 'Ocultar' : 'Mostrar'} Historial
          </button>
          
          <button
            onClick={() => indiceHistorial > 0 && restaurarDesdeHistorial(indiceHistorial - 1)}
            disabled={indiceHistorial <= 0}
            style={{
              padding: '5px 10px',
              background: indiceHistorial <= 0 ? '#7f8c8d' : '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: indiceHistorial <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Deshacer
          </button>
          
          <button
            onClick={() => indiceHistorial < historial.length - 1 && restaurarDesdeHistorial(indiceHistorial + 1)}
            disabled={indiceHistorial >= historial.length - 1}
            style={{
              padding: '5px 10px',
              background: indiceHistorial >= historial.length - 1 ? '#7f8c8d' : '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: indiceHistorial >= historial.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Rehacer →
          </button>
          
          <span style={{ fontSize: '12px', opacity: 0.8 }}>
            {historial.length > 0 ? `${indiceHistorial + 1}/${historial.length}` : 'Sin historial'}
          </span>
        </div>
      </div>

      {/* 🆕 Panel de historial expandible */}
      {mostrarHistorial && (
        <div style={{
          padding: '10px',
          background: '#ecf0f1',
          borderBottom: '1px solid #bdc3c7',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Historial de Cambios (En Memoria)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {historial.map((item, index) => (
              <div
                key={index}
                onClick={() => restaurarDesdeHistorial(index)}
                style={{
                  padding: '8px 12px',
                  background: index === indiceHistorial ? '#3498db' : 'white',
                  color: index === indiceHistorial ? 'white' : 'black',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{item.descripcion}</div>
                <div style={{ opacity: 0.8 }}>
                  {new Date(item.timestamp).toLocaleString()} - {item.paginas.length} página(s)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor principal */}
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        <div
          id="blocks"
          style={{
            width: '250px',
            borderRight: '1px solid #ccc',
            padding: '10px',
            overflowY: 'auto',
            background: '#f9f9f9'
          }}
        />
        <div id="editor" style={{ flex: 1 }} />
      </div>
      
      <ChatGeminIA />
    </>
  );
};

export default EditorGrapes;