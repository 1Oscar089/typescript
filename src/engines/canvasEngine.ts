/**
 * Motor 'canvas' (HTML5 Canvas 2D): dibujo píxel a píxel mediante JavaScript.
 * Ideal para minijuegos y edición de imágenes. Base preparada para futuras
 * integraciones con Fabric.js o Konva.js.
 *
 * Si el componente no define su propio markup, el motor aporta un <canvas>
 * por defecto; el script del componente obtiene el contexto 2D y dibuja.
 */
import type { CodeBlock, EngineContext, RenderingEngine } from '../types/engine.js';

export const canvasEngine: RenderingEngine = {
  meta: {
    id: 'canvas',
    name: 'Motor Canvas 2D',
    short: 'Canvas',
    description: 'Dibujo píxel a píxel mediante JavaScript: minijuegos, partículas y edición de imágenes.',
    tools: 'Canvas API · Fabric.js · Konva.js',
    status: 'activo',
  },

  render({ component, values }: EngineContext): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const { html, css, js } = component.template;

    const markup = html
      ? html(values)
      : '<div class="gc-canvas-frame">\n  <canvas class="gc-canvas" width="480" height="320"></canvas>\n</div>';
    blocks.push({ lang: 'html', label: 'HTML', code: markup.trim() });

    // Los bloques cuyo contenido queda vacío se omiten (pestañas sin código).
    if (css) {
      const code = css(values).trim();
      if (code) blocks.push({ lang: 'css', label: 'CSS', code });
    }
    if (js) {
      const code = js(values).trim();
      if (code) blocks.push({ lang: 'js', label: 'JavaScript', code });
    }

    return blocks;
  },
};