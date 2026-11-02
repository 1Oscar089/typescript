/**
 * Motor 'dom': componentes web clásicos (HTML + CSS + JS).
 * Toma las plantillas puras del componente, las resuelve con los valores
 * actuales del panel de configuración y las empaqueta como bloques de código
 * listos para copiar y pegar en cualquier proyecto externo.
 */
import type { CodeBlock, EngineContext, RenderingEngine } from '../types/engine.js';

export const domEngine: RenderingEngine = {
  meta: {
    id: 'dom',
    name: 'Motor DOM',
    short: 'DOM',
    description: 'Componentes web clásicos: inyecta etiquetas HTML, estilos CSS y enlaza eventos JS.',
    tools: 'HTML + CSS + JS nativo',
    status: 'activo',
  },

  render({ component, values }: EngineContext): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const { html, css, js } = component.template;

    // Los bloques cuyo contenido queda vacío (p. ej. un js condicional) se
    // omiten para no mostrar pestañas sin código en la interfaz.
    if (html) {
      const code = html(values).trim();
      if (code) blocks.push({ lang: 'html', label: 'HTML', code });
    }
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