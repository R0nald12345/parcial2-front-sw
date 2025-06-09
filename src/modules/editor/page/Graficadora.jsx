import React, { useEffect, useRef, useState } from 'react';

import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { crearComponentes, obtenerComponentes, obtenerPaginas } from '../api/api_componentes';
import { io } from 'socket.io-client'; 
import { useParams } from 'react-router-dom';
import { ChatGeminIA } from '../components/chatGeminIA';


const socket = io('http://localhost:3000');

const componentesDesdeBDLocal = [
{
  "id": "temp-1749347105811-467",
  "tipo": "wrapper",
  "datos": "{\"tagName\":\"div\",\"type\":\"wrapper\",\"classes\":[\"wrapper-class\"],\"attributes\":{\"data-id-db\":\"temp-1749347105811-467\"},\"components\":[{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Heading 1\"}],\"attributes\":{\"id\":\"iiyp\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Paragraph 1\"}],\"attributes\":{\"id\":\"iwoe\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Heading 2\"}],\"attributes\":{\"id\":\"i98oc\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Paragraph 2\"}],\"attributes\":{\"id\":\"ipsfs\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Heading 3\"}],\"attributes\":{\"id\":\"is7bx\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Paragraph 3\"}],\"attributes\":{\"id\":\"ie5x5\"}},{\"type\":\"text\",\"tagName\":\"div\",\"components\":[{\"type\":\"textnode\",\"content\":\"Centered Text\"}],\"attributes\":{\"id\":\"igkdr\"}}]}",
  "html": "<div data-id-db=\"temp-1749347105811-467\" class=\"wrapper-class\"> <div id=\"iiyp\">Heading 1</div>  <div id=\"iwoe\">Paragraph 1</div>  <div id=\"i98oc\">Heading 2</div>  <div id=\"ipsfs\">Paragraph 2</div>  <div id=\"is7bx\">Heading 3</div>  <div id=\"ie5x5\">Paragraph 3</div>  <div id=\"igkdr\">Centered Text</div></div>",
  "style": "{\".wrapper-class\":{\"box-sizing\":\"border-box\",\"margin\":\"0\"},\"#iiyp\":{\"font-size\":\"2em\",\"font-weight\":\"bold\"},\"#iwoe\":{\"font-size\":\"1em\"},\"#i98oc\":{\"font-size\":\"2em\",\"font-weight\":\"bold\"},\"#ipsfs\":{\"font-size\":\"1em\"},\"#is7bx\":{\"font-size\":\"2em\",\"font-weight\":\"bold\"},\"#ie5x5\":{\"font-size\":\"1em\"},\"#igkdr\":{\"text-align\":\"center\"}}",
  "creado_en": null,
  "id_proyecto": 1
}
];

const EditorGrapes = () => {
  const id_proyecto = useParams();
  
  const [componentes, setComponentes]= useState([]);
  const [paginas, setPaginas] = useState([]);
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

     

      const fetchPaginas = async () => {
    const response = await obtenerPaginas();
    console.log("páginas desde la base de datos", response.data);
    const paginasFiltradas = response.data.filter(
      (p) => p.id_proyecto === parseInt(id_proyecto.id_board)
    );
    console.log("páginas filtradas", paginasFiltradas);

    setPaginas(paginasFiltradas);
    
   
    setCargando(false);
  };

  fetchPaginas();
    

    
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


  
pageManager: {
    pages: [] // Iniciar sin páginas
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

// Después de la inicialización del editor (editor.init)
const setupPageManager = () => {
  // Crear contenedor de páginas
  const pagesContainer = document.createElement('div');
  pagesContainer.className = 'pages-manager';
  pagesContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    background: white;
    padding: 10px;
    border-left: 1px solid #ccc;
    z-index: 100;
  `;

  // Función para actualizar UI de páginas
  const updatePagesUI = () => {
    const pages = editor.Pages.getAll();
    const selected = editor.Pages.getSelected();

    pagesContainer.innerHTML = `
      <h3>Páginas</h3>
      <div class="pages-list">
        ${pages.map(page => `
          <div class="page-item" style="
            padding: 5px;
            margin: 5px 0;
            cursor: pointer;
            background: ${selected.id === page.id ? '#e0e0e0' : 'white'}
          ">
            ${page.get('name')}
          </div>
        `).join('')}
      </div>
      <button class="add-page-btn">Nueva Página</button>
    `;

    // Handler para click en páginas
    pagesContainer.querySelectorAll('.page-item').forEach((el, i) => {
      el.onclick = () => editor.Pages.select(pages[i].id);
    });

    // Handler para nueva página
    pagesContainer.querySelector('.add-page-btn').onclick = async () => {
  const name = prompt('Nombre de la página:');
  if (name) {
    // 1. Generar ID único
    const pageId = `page-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // 2. Crear datos de la página
    const pageData = {
      id: pageId, // ID personalizado
      name: name,
      id_proyecto: parseInt(id_proyecto.id_board),
      components: editor.getComponents(),
      html: `<div class="${name.toLowerCase()}-page">${name} Content</div>`,
      css: `.${name.toLowerCase()}-page { color: black }`,
      created_at: new Date().toISOString()
    };

    try {
      // 3. Desactivar temporalmente el listener de componentes
      editor.off('component:add', onComponentAdd);

      // 4. Agregar la página al editor forzando nuestro ID
      const newPage = editor.Pages.add({
        id: pageId, // Usar nuestro ID personalizado
        name: pageData.name,
        component: pageData.html,
        // Forzar el ID en los componentes internos
        attributes: {
          'data-gjs-id': pageId,
          'data-page-id': pageId
        }
      });

      // 5. Emitir evento después de crear la página
      socket.emit('paginaCreada', pageData);
      console.log('Nueva página creada:', pageData);

      // 6. Reactivar el listener de componentes
      editor.on('component:add', onComponentAdd);

      // 7. Seleccionar la página recién creada
      editor.Pages.select(pageId);

    } catch (error) {
      console.error('Error al crear página:', error);
    }
  }
};
   
  };

  editor.on('page', updatePagesUI);
  document.body.appendChild(pagesContainer);
  updatePagesUI();
};

// Inicializar el manejador de páginas
editor.on('load', setupPageManager);



// Handle page selection
editor.on('page:select', (page) => {
  console.log('Selected page:', page.get('name'));
});

// Save page content before switching
editor.on('page:before:select', (nextPage, prevPage) => {
  if (prevPage) {
    const component = prevPage.getMainComponent();
    prevPage.set('styles', editor.getCss({ component }));
    prevPage.set('component', editor.getHtml({ component }));
  }
});

 const onComponentAdd = (component) => {
  if (component.get('type') !== 'textnode') {
    // 🔐 Generar una clase única si no tiene
    const currentPage = editor.Pages.getSelected();
    if (!currentPage) {
      console.error('No hay página seleccionada');
      return;
    }

    const pageId = currentPage.get('id');
    console.log('ID de página actual:', pageId);
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
      id_proyecto: parseInt(id_proyecto.id_board),
      tipo,
      datos,
      html,
      style:nuevoestilo,
      id_pagina:pageId,
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
    id, 
    id_proyecto: id_proyecto.id_board,
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

// Reemplazar el código actual de parseo de páginas con esto:
const paginasDesdeBD = paginas.map(pagina => {
  try {
    // Validar que components y css existan
    const componentsStr = pagina.components || '{}';
    const cssStr = pagina.css || '';

    // Intentar parsear components con manejo de error
    let parsedComponents;
    try {
      parsedComponents = JSON.parse(componentsStr);
    } catch (error) {
      console.error('Error parseando components de página:', error);
      parsedComponents = {};
    }

    return {
      ...pagina,
      components: parsedComponents,
      css: cssStr
    };
  } catch (error) {
    console.error('Error procesando página:', pagina.id, error);
    // Retornar objeto válido en caso de error
    return {
      ...pagina,
      components: {},
      css: ''
    };
  }
});

console.log('Páginas desde la BD:', paginasDesdeBD);

// Cargar solo las páginas válidas
paginasDesdeBD.forEach(pagina => {
  try {
    editor.Pages.add({
      id: pagina.id,
      name: pagina.name,
      component: pagina.html || `<div>Página ${pagina.name}</div>`,
      styles: pagina.css
    });
  } catch (error) {
    console.error('Error cargando página en editor:', pagina.id, error);
  }
});

// Reemplaza el código de carga de componentes actual con este:
componentesDesdeBD.forEach(comp => {
  if (comp.id_pagina) {
    // Primero seleccionar la página correcta
    editor.Pages.select(comp.id_pagina);
    
    // Obtener la página actual
    const currentPage = editor.Pages.getSelected();
    if (currentPage) {
      // Agregar el componente a la página específica
      currentPage.getMainComponent().append(comp.html);

      // Agregar los estilos
      const estilos = Object.entries(comp.style).map(([selector, styleObj]) => ({
        selectors: [selector.replace(/^\./, '')],
        style: styleObj
      }));

      editor.addStyle(estilos);
    }
  }
});

// Después de cargar todo, seleccionar la primera página
if (paginasDesdeBD.length > 0) {
  editor.Pages.select(paginasDesdeBD[0].id);
}

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
    <div style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <button onClick={()=>crearcompoente()}>Limpiar todo</button>
      <div className="pages-manager-container"></div>
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
    <ChatGeminIA/>
  </>
);
};

export default EditorGrapes;
