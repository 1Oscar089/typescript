/**
 * Motor 'svg': gráficos vectoriales escalables nativos.
 * El markup del componente es un <svg> completo; el motor lo empaqueta junto
 * a sus estilos y su script opcional. Preparado para aportar utilidades
 * propias de SVG (viewBox, escalado, sistemas de iconos) en el futuro.
 */
import type { CodeBlock, EngineContext, RenderingEngine } from '../types/engine.js';

export const svgEngine: RenderingEngine = {
  meta: {
    id: 'svg',
    name: 'Motor SVG',
    short: 'SVG',
    description: 'Gráficos vectoriales escalables nativos: iconos y formas con viewBox y trazos parametrizables.',
    tools: 'SVG nativo (viewBox, trazos)',
    status: 'activo',
  },

  render({ component, values }: EngineContext): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const { html, css, js } = component.template;

    if (html) blocks.push({ lang: 'html', label: 'SVG', code: html(values).trim() });
    if (css) blocks.push({ lang: 'css', label: 'CSS', code: css(values).trim() });
    if (js) blocks.push({ lang: 'js', label: 'JavaScript', code: js(values).trim() });

    return blocks;
  },
};
