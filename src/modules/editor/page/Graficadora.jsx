import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { crearComponentes, obtenerComponentes } from '../api/api_componentes';
import { io } from 'socket.io-client'; 
import { useParams } from 'react-router-dom';


const socket = io('http://localhost:3000');



const EditorGrapes = () => {
  const id_proyecto = useParams();
  
  const [componentes, setComponentes]= useState([]);
  const [cargando, setCargando] = useState(true);
      

    
  
  const editorRef = useRef(null);


  useEffect(() => {
    setCargando(true);
    console.log("id del proyecto id_board", id_proyecto.id_board);
    const fetchComponentes = async () => {
      const response = await obtenerComponentes();
      console.log("componentes desde la base de datos", response.data);
      const componentesFiltrados = response.data.filter((c) => c.id_proyecto ===  parseInt(id_proyecto.id_board));
      setComponentes(componentesFiltrados);
      setCargando(false);
    };
    fetchComponentes();
  }, []);

  useEffect(() => {


     socket.on('connect', () => {
      console.log('Conectado con ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado:', socket.id);
    });
   
    if (componentes.length === 0 && cargando===true) return;

   



  

    const editor = grapesjs.init({
      container: '#editor',
      fromElement: false,
      height: '100vh',
      storageManager: false,
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

    // Agrega bloques adicionales
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

    editor.Panels.getButton('views', 'open-blocks')?.set('active', true); 



 const onComponentAdd = (component) => {
  if (component.get('type') !== 'textnode') {
    // 🔐 Generar una clase única si no tiene
    const cid = component.getId(); // ID interno único de GrapesJS
    const className = `comp-${cid}`;

    // 📌 Agregar clase al componente si no tiene ninguna
    const existingClasses = component.getClasses();
    if (!existingClasses.includes(className)) {
      component.addClass(className);
    }

    const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    component.addAttributes({ 'data-id-db': tempId });
    // 📦 Capturar info del componente
    const nuevoestilo = {
      [`.${className}`]: component.getStyle() // Estilo con selector CSS
    };
    const html = component.toHTML();
    const tipo = component.get('type');
    const datos = component.toJSON({ shallow: false });

    const nuevoItem = {
      id: tempId,
      id_proyecto: id_proyecto.id_board,
      tipo,
      datos,
      html,
      style:nuevoestilo,
      creado_en: new Date().toISOString()
    };

    socket.emit('componenteCreado', nuevoItem);
    console.log('🆕 Componente agregado:', nuevoItem);
    


  }
};


  socket.on('actualizadoComponenteCreado', (data) => {
    console.log('Componente creado actualizado en todos lados:', data);
  
});






editor.on('component:styleUpdate', (component) => {
  const clase = component.getClasses()[0];
  if (!clase) return;

  const cssRule = editor.CssComposer.getRule(`.${clase}`);
  const estiloPorClase = cssRule ? cssRule.getStyle() : {};
  const html = component.toHTML();
  const tipo = component.get('type');
  const datos = component.toJSON({ shallow: false });

  // Recuperar ID del atributo guardado
  const id = component.getAttributes()['data-id-db'];
 console.log('ID recuperado:', id);
  const itemActualizado = {
    id, // 👈 Este ID ya existe en la base de datos
    id_proyecto: 1,
    tipo,
    datos,
    html,
    style: { [`.${clase}`]: estiloPorClase },
    actualizado_en: new Date().toISOString()
  };

  socket.emit('componenteActualizado', itemActualizado);
});






   const componentesEjemplo = [
  
];

// ⛔️ Quitar temporalmente el listener

const componentesDesdeBD = componentes.map(row => {
  return {
    ...row,
    datos: JSON.parse(row.datos),
    style: JSON.parse(row.style)
  };
});

console.log('Componentes desde la BD:', componentesDesdeBD);
editor.off('component:add', onComponentAdd);

componentesDesdeBD.forEach(comp => {
  editor.addComponents(comp.html); // Renderiza el HTML directamente

  // Convertir el estilo al formato que espera GrapesJS
  const estilos = Object.entries(comp.style).map(([selector, styleObj]) => ({
    selectors: [selector.replace(/^\./, '')], // Quitar el punto inicial
    style: styleObj
  }));

  editor.addStyle(estilos);
});

editor.on('component:add', onComponentAdd);



/*editor.on('component:add', (component) => {
  const datos = component.toJSON({ shallow: false });
  console.log('🆕 Componente agregado:', datos);
});

editor.on('component:styleUpdate', (component) => {
  const datos = component.getStyle()
  console.log('🎨 Estilo actualizado:', datos);
});*/

   

return () => editor.destroy();
  }, [componentes,cargando]);

 

  return (
    <>
      <div style={{ padding: '10px', background: '#eee' }}>
        <button onClick={()=>crearcompoente()}>Limpiar todo</button>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
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
    </>
  );
};

export default EditorGrapes;
