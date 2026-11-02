/**
 * Motor 'webgl': gráficos 3D por hardware (GPU) mediante WebGL nativo.
 *
 * Los componentes aportan sus shaders GLSL, geometría y bucle de render;
 * el motor solo empaqueta markup + estilos + script como los demás motores
 * (patrón Strategy). Si el componente no define su propio markup, el motor
 * aporta un <canvas> listo para obtener el contexto 'webgl'.
 *
 * Preparado para componentes con librerías de alto nivel (Three.js,
 * Babylon.js): basta con que su plantilla js cargue el código necesario.
 */
import type { CodeBlock, EngineContext, RenderingEngine } from '../types/engine.js';

export const webglEngine: RenderingEngine = {
  meta: {
    id: 'webgl',
    name: 'Motor WebGL 3D',
    short: 'WebGL',
    description: 'Gráficos 3D por hardware (GPU): shaders GLSL, profundidad y render en tiempo real.',
    tools: 'WebGL nativo (GLSL) · Three.js · Babylon.js',
    status: 'activo',
  },

  render({ component, values }: EngineContext): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const { html, css, js } = component.template;

    const markup = html
      ? html(values)
      : '<div class="gc-webgl-frame">\n  <canvas class="gc-webgl" width="520" height="380"></canvas>\n</div>';
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