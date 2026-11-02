import { RenderingEngine } from '../types/engine.js';

export const webEngines: RenderingEngine[] = [
  {
    id: 'dom',
    name: '1. HTML/CSS (DOM Tradicional)',
    description: 'Renderizado nativo del navegador basado en etiquetas.',
    tools: 'Vanilla, React, Vue'
  },
  {
    id: 'svg',
    name: '2. Gráficos Vectoriales (SVG)',
    description: 'Imágenes 2D escalables sin pérdida de calidad. Ideal para iconos y gráficos matemáticos.',
    tools: 'D3.js, Snap.svg'
  },
  {
    id: 'canvas2d',
    name: '3. HTML5 Canvas 2D',
    description: 'Dibujo pixel a pixel mediante JS. Ideal para minijuegos y edición de imágenes.',
    tools: 'Fabric.js, Konva.js'
  },
  {
    id: 'webgl',
    name: '4. WebGL (Gráficos 3D)',
    description: 'Renderiza objetos 3D complejos usando la tarjeta gráfica (GPU).',
    tools: 'Three.js, Babylon.js'
  },
  {
    id: 'webxr',
    name: '5. WebXR (Realidad Virtual/Aumentada)',
    description: 'Creación de entornos 3D interactivos para gafas VR o cámaras de celular.',
    tools: 'A-Frame'
  },
  {
    id: 'game_engine',
    name: '6. Motores de Videojuegos',
    description: 'Gestión de objetos con leyes físicas (gravedad, colisiones).',
    tools: 'Phaser, PixiJS'
  }
];