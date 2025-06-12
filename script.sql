REATE TABLE usuarios (
    id SERIAL PRIMARY KEY,             -- Identificador único del usuario
    nombre VARCHAR(255) NOT NULL,      -- Nombre del usuario
    apellido VARCHAR(255) not null,
    telefono VARCHAR(255) not null,
    email VARCHAR(255) UNIQUE NOT NULL, -- Email único del usuario
    password VARCHAR(255) not null
    
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,         -- Identificador único del proyecto
    nombre VARCHAR(255) NOT NULL,  -- Nombre del proyecto
    descripcion VARCHAR(255),              -- Descripción opcional del proyecto
    usuario_id INTEGER,-- Creador del proyecto
    permisosenlace VARCHAR(20) CHECK (permisosenlace IN ('ninguno', 'lectura', 'escritura'))
);

CREATE TABLE compartir_proyectos (
    usuario_id INTEGER NOT NULL,      -- Usuario con quien se comparte el proyecto
    proyecto_id INTEGER NOT NULL,     -- Proyecto compartido
    escritura BOOLEAN not null,
    PRIMARY KEY (usuario_id, proyecto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE on UPDATE CASCADE,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE on update CASCADE
);
drop TABLE componentes

-- Tabla paginas (new)
CREATE TABLE paginas (
    id VARCHAR PRIMARY KEY,                -- page.get('id')
    name VARCHAR(255) NOT NULL,            -- page.get('name')
    styles TEXT,                           -- page.get('styles')
    components TEXT,                       -- page.getMainComponent().toJSON()
    html TEXT,                            -- editor.getHtml()
    css TEXT,                             -- editor.getCss()
    id_proyecto INTEGER NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id) ON DELETE CASCADE ON UPDATE CASCADE
);
select * from paginas

CREATE TABLE componentes (
    id VARCHAR PRIMARY KEY,
    tipo VARCHAR(500) NOT NULL,
    datos TEXT NOT NULL,                   -- Changed from VARCHAR(5000) to TEXT
    html TEXT NOT NULL,                    -- Changed from VARCHAR(1000) to TEXT
    style TEXT NOT NULL,                   -- Changed from VARCHAR(5000) to TEXT
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_proyecto INTEGER NOT NULL,
    id_pagina VARCHAR,                     -- Reference to paginas
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_pagina) REFERENCES paginas(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DELETE FROM componentes;