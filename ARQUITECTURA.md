=============================================================================
DOCUMENTO DE ARQUITECTURA: SISTEMA GENERADOR DE COMPONENTES UI MULTI-MOTOR
=============================================================================

1. EXPLICACIÓN DEL PROYECTO
-----------------------------------------------------------------------------
Este proyecto es un "Generador y Registro de Componentes UI Dinámicos". Su
objetivo es crear una biblioteca viva de elementos de interfaz (botones,
navegación, gráficos, iconos, formularios, tarjetas, utilidades, textos y
layout) que no son estáticos, sino parametrizables.

A través de un buscador (header, por título o etiquetas), un sidebar por
categorías (con opción "Todas") y un filtrador por motor (contenido), el
usuario encuentra cada componente como una tarjeta con miniatura viva. Al
hacer clic se abre un MODAL de personalización con deslizadores, inputs,
selects, radios, switches y colores; el sistema compila y devuelve el código
exacto listo para copiar y pegar en cualquier proyecto externo, además de
renderizar una vista previa en tiempo real dentro de un iframe aislado.

Incluye MODO CLARO y MODO OSCURO (toggle en el header, persistente en
localStorage y respetando prefers-color-scheme en la primera visita).

2. HERRAMIENTAS Y TECNOLOGÍAS UTILIZADAS
-----------------------------------------------------------------------------
- Lenguaje Principal: TypeScript (para un tipado estricto de las propiedades
  y la estructura de los componentes).
- Patrón de Diseño: Arquitectura Modular basada en Registro (Registry Pattern)
  y Patrón Estrategia (Strategy) para los motores de renderizado.
- Estilos base: CSS encapsulado de forma nativa + variables CSS para temas.

3. LOS MOTORES DE RENDERIZADO (ENGINES)
-----------------------------------------------------------------------------
El sistema es "Multi-Motor": la lógica central delega cómo se construye e
inyecta un componente dependiendo de su naturaleza (patrón Strategy).

MOTORES ACTIVOS:
- Motor 'dom'   (DOM): componentes web clásicos (HTML/CSS/JS).
- Motor 'svg'   (SVG): gráficos vectoriales escalables nativos.
- Motor 'canvas'(Canvas 2D): dibujo píxel a píxel. Fabric.js, Konva.js.

MOTORES [FUTURO] registrados con aviso visible (creados con la fábrica
engines/futureEngine.ts, listos para su integración real):

1. WebGL (Gráficos 3D por Hardware)
   - Uso: Renderiza objetos tridimensionales complejos, luces y texturas
     usando la tarjeta gráfica (GPU).
   - Herramientas: Three.js (la más popular), Babylon.js.

2. WebXR (Realidad Virtual y Aumentada)
   - Uso: Creación de objetos e interiores interactivos en 3D compatibles
     con gafas VR o cámaras de celular.
   - Herramientas: A-Frame (etiquetas tipo HTML como <a-box>).

3. Motores de Videojuegos (Objetos con leyes físicas)
   - Uso: Gestión de múltiples objetos en pantalla con gravedad, colisiones
     y rebotes controlados.
   - Herramientas: Phaser (juegos 2D), PixiJS (2D masivo y ultrarrápido).

4. WebAssembly (C++ / Rust / Go)
   - Uso: Ejecución de simulaciones matemáticas de miles de objetos en
     tiempo real a velocidad de software nativo de PC.

4. CATEGORÍAS DEL REGISTRO (SIDEBAR, CON OPCIÓN "TODAS")
-----------------------------------------------------------------------------
'botones' | 'navegacion' | 'graficos' | 'iconos' | 'formularios'
| 'tarjetas' | 'utilidades' | 'textos' | 'layout'

5. ESTRUCTURA DEL PROYECTO (ÁRBOL DE DIRECTORIOS)
-----------------------------------------------------------------------------

/ (Raíz del Proyecto)
│
├── index.html                 # Base de la SPA (en la raíz: ver nota abajo)
├── package.json               # Dependencias y scripts del proyecto
├── tsconfig.json              # Configuración estricta de TypeScript
├── ARQUITECTURA.md            # Este documento (memoria del proyecto)
│
├── .github/workflows/deploy.yml   # Deploy a GitHub Pages (rama main)
│
├── public/                    # Estáticos (favicon.svg, styles.css con temas)
│
└── src/                       # Código fuente principal
    │
    ├── main.ts                # Punto de entrada (lo carga index.html)
    │
    ├── types/                 # (LÓGICA) Definiciones de tipos globales
    │   ├── component.ts       # UIComponentItem, UIControl, CategoryId, tags
    │   └── engine.ts          # RenderingEngine, EngineContext, EngineId x7
    │
    ├── core/                  # (LÓGICA) Lógica central de la aplicación
    │   ├── generator.ts       # Orquestador que une los inputs con el código
    │   └── previewRender.ts   # Iframes aislados (modal completo + miniatura)
    │
    ├── engines/               # (LÓGICA) MOTORES (patrón Strategy)
    │   ├── index.ts           # Registro de motores (7)
    │   ├── domEngine.ts       # Motor DOM (HTML/CSS/JS)          [activo]
    │   ├── svgEngine.ts       # Motor SVG                        [activo]
    │   ├── canvasEngine.ts    # Motor Canvas 2D                  [activo]
    │   ├── futureEngine.ts    # Fábrica de motores [futuro]
    │   ├── webglEngine.ts     # Three.js / Babylon.js            [futuro]
    │   ├── webxrEngine.ts     # A-Frame                          [futuro]
    │   ├── gameEngine.ts      # Phaser / PixiJS                  [futuro]
    │   └── wasmEngine.ts      # C++ / Rust / Go                  [futuro]
    │
    ├── data/                  # (LÓGICA Y REGISTRO)
    │   ├── componentsData.ts  # REGISTRO CENTRAL ('componentsRegistry')
    │   │
    │   └── components/        # (DESTINO DE ARCHIVOS)
    │       ├── botones/       # domBotonPrimario, domBotonBorrar
    │       ├── navegacion/    # domNavbar
    │       ├── graficos/      # canvasLluviaParticulas
    │       ├── iconos/        # svgIconoBasurero, svgIconoEstrella
    │       ├── formularios/   # domCampoTexto
    │       ├── tarjetas/      # domTarjetaPerfil
    │       ├── utilidades/    # domSpinnerCarga
    │       ├── textos/        # domTituloGradiente
    │       └── layout/        # domSeparador
    │
    └── ui/                    # (LÓGICA VISUAL) La interfaz de la propia app
        ├── App.ts             # Shell, estado, buscador, tema claro/oscuro
        ├── Sidebar.ts         # Categorías con opción "Todas" y contadores
        ├── CardGrid.ts        # Chips de motor + tarjetas con miniatura viva
        ├── ComponentModal.ts  # Modal: preview + código + copia
        └── ConfigPanel.ts     # Sliders, inputs, selects, radios, switches

-----------------------------------------------------------------------------
NOTAS DE IMPLEMENTACIÓN (v0.2):
- index.html vive en la raíz porque el workflow de GitHub Pages
  (upload-pages-artifact con path: '.') lo sirve correctamente; public/
  conserva los recursos estáticos (favicon.svg, styles.css).
- El tema se aplica antes de pintar (script inline) para evitar FOUC.
- Las miniaturas de las tarjetas son iframes sandbox con los valores por
  defecto de cada componente (biblioteca "viva").
- Despliegue: push a 'main' -> .github/workflows/deploy.yml (GitHub Actions).
  Recordar activar Settings -> Pages -> Source: "GitHub Actions".
