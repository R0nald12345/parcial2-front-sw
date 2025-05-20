import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const EditorGrapes = () => {
  const editorRef = useRef(null);

  useEffect(() => {
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

// 🔷 VARIABLES GLOBALES
let componentesGuardados = [];
const idProyecto = 101; // ID de tu proyecto, lo podés reemplazar dinámicamente

// 🔷 Cargar datos previos si existen
const cargarComponentesIndividuales = () => {
  const stored = localStorage.getItem('componentes-individuales');
  if (stored) {
    componentesGuardados = JSON.parse(stored);
    console.log('📂 Componentes cargados del localStorage:', componentesGuardados);
  }
};


// 🔷 Carga inicial de componentes que ya existen en el editor
const inicializarComponentesExistentes = () => {
  const allComponents = editor.getWrapper().components();
  console.log(`📦 Componentes iniciales en el editor: ${allComponents.length}`);
};

// 🔷 Escuchar eventos del editor
const ignorarTipos = ['textnode', 'wrapper', 'body'];

// 🟢 Agregado
editor.on('component:add', (component) => {
  const tipo = component.get('type');
  if (!ignorarTipos.includes(tipo)) {
    let attrs = component.get('attributes') || {};
    if (!attrs.uid) {
      const uid = 'comp-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      component.addAttributes({ uid });
      attrs.uid = uid;
    }

    const uid = attrs.uid;
    const datos = component.toJSON({ shallow: false });
    datos.attributes = datos.attributes || {};
    datos.attributes.uid = uid;

    const index = componentesGuardados.findIndex(c => c.datos?.attributes?.uid === uid);

 const style = component.getStyle();
const html = component.toHTML();
console.log(style, html);

const nuevoItem = {
  id: index !== -1 ? componentesGuardados[index].id : componentesGuardados.length + 1,
  id_proyecto: idProyecto,
  tipo,
  datos,
  html,        // ✅ HTML del componente
  style, // ✅ Estilos del componente
  creado_en: new Date().toISOString()
};

    if (index !== -1) {
      componentesGuardados[index] = nuevoItem;
    } else {
      componentesGuardados.push(nuevoItem);
    }

    localStorage.setItem('componentes-individuales', JSON.stringify(componentesGuardados));
  }
});

// 🔴 Eliminado
editor.on('component:remove', (component) => {
  const tipo = component.get('type');
  if (!ignorarTipos.includes(tipo)) {
    const attrs = component.get('attributes') || {};
    const uid = attrs.uid || component.cid || component.id;

    componentesGuardados = componentesGuardados.filter(
      c => c.datos?.attributes?.uid !== uid
    );

    localStorage.setItem('componentes-individuales', JSON.stringify(componentesGuardados));
    console.log('🗑️ Componente eliminado de memoria:', uid);
  }
});

// ✏️ Cualquier cambio general (estilo, texto, atributo, etc.)
const eventosGuardar = [
  'component:input',
  'component:update',
  'component:update:name',
  'component:style:update',
  'component:attribute:update',
  'component:content:update',
];

eventosGuardar.forEach(evento => {
  editor.on(evento, (component) => {
    const tipo = component.get('type');
    if (!ignorarTipos.includes(tipo)) {
      let attrs = component.get('attributes') || {};
      let uid = attrs.uid;
      if (!uid) {
        uid = 'comp-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        component.addAttributes({ uid });
        attrs.uid = uid;
      }

      const datos = component.toJSON({ shallow: false });
      datos.attributes = datos.attributes || {};
      datos.attributes.uid = uid;

      const index = componentesGuardados.findIndex(c => c.datos?.attributes?.uid === uid);

       const style = component.getStyle();
       const html = component.toHTML();

       console.log(style, html);

      const nuevoItem = {
        id: index !== -1 ? componentesGuardados[index].id : componentesGuardados.length + 1,
        id_proyecto: idProyecto,
        tipo,
        datos,
        html,        // ✅ HTML del componente
        style, // ✅ Estilos del componente
        creado_en: new Date().toISOString()
      };

      if (index !== -1) {
        componentesGuardados[index] = nuevoItem;
      } else {
        componentesGuardados.push(nuevoItem);
      }

      localStorage.setItem('componentes-individuales', JSON.stringify(componentesGuardados));
    }
  });
});

// ... Tus otros listeners ...



// ... El resto de tu código ...

// 🔷 Carga si hay diseño completo guardado
const stored = localStorage.getItem('grapes-data');
if (stored) {
  const parsed = JSON.parse(stored);
  editor.setComponents(parsed.json);
  editor.setStyle(parsed.css || '');
  console.log('✅ Diseño completo cargado desde grapes-data');
} else {
  const individuales = localStorage.getItem('componentes-individuales');
  if (individuales) {
    const lista = JSON.parse(individuales);
    const componentesJson = lista.map(item => item.datos);
    editor.setComponents(componentesJson);
    console.log('🔁 Editor reconstruido desde componentes individuales');
  }
}

// 🔷 Guardado completo opcional
const saveToLocalStorage = () => {
  const json = editor.getComponents();
  const html = editor.getHtml();
  const css = editor.getCss();
  const fullData = { html, css, json };
  localStorage.setItem('grapes-data', JSON.stringify(fullData));
  console.log('💾 Guardado completo del editor en localStorage');
};

// 🔷 Inicializar
cargarComponentesIndividuales();
editor.on('load', () => {
  inicializarComponentesExistentes();
});



    
  }, []);

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.DomComponents.clear();
      editorRef.current.CssComposer.clear();
      localStorage.removeItem('grapes-data');
      alert('Editor y localStorage limpiados');
    }
  };

  return (
    <>
      <div style={{ padding: '10px', background: '#eee' }}>
        <button onClick={clearEditor}>Limpiar todo</button>
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
