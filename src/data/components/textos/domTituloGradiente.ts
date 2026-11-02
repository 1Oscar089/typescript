/**
 * Componente DOM: título con degradado de texto.
 * Motor: 'dom'. Categoría: textos.
 *
 * Demuestra el control 'radio' para tipografías y el truco CSS de
 * background-clip: text con dos colores y ángulo configurables.
 */
import type { ComponentValues, UIComponentItem } from '../../../types/component.js';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function esc(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

export const domTituloGradiente: UIComponentItem = {
  id: 'dom-titulo-gradiente',
  name: 'Título con degradado',
  description:
    'Titular con degradado de texto (dos colores y ángulo) y tipografía seleccionable: sans, serif o monoespaciada.',
  tags: ['título', 'gradiente', 'tipografía', 'heading', 'texto'],
  category: 'textos',
  engine: 'dom',
  controls: [
    { key: 'texto', label: 'Texto', type: 'text', defaultValue: 'Diseño sin límites', placeholder: 'Tu titular' },
    { key: 'color1', label: 'Color inicial', type: 'color', defaultValue: '#7aa2ff' },
    { key: 'color2', label: 'Color final', type: 'color', defaultValue: '#b18cff' },
    { key: 'angulo', label: 'Ángulo del degradado (°)', type: 'range', defaultValue: 90, min: 0, max: 360, step: 5 },
    { key: 'tamano', label: 'Tamaño (px)', type: 'range', defaultValue: 48, min: 28, max: 72, step: 2 },
    {
      key: 'fuente',
      label: 'Tipografía',
      type: 'radio',
      defaultValue: 'sans',
      options: [
        { value: 'sans', label: 'Sans' },
        { value: 'serif', label: 'Serif' },
        { value: 'mono', label: 'Mono' },
      ],
    },
  ],

  template: {
    html: (values: ComponentValues): string =>
      `<h2 class="titulo-gradiente titulo-gradiente--${String(values.fuente)}">${esc(String(values.texto))}</h2>`,

    css: (values: ComponentValues): string => {
      const fuentes: Record<string, string> = {
        sans: '  font-family: "Segoe UI", system-ui, sans-serif;',
        serif: '  font-family: Georgia, "Times New Roman", serif;',
        mono: '  font-family: "Cascadia Code", Consolas, monospace;',
      };

      return `.titulo-gradiente {
  margin: 0;
${fuentes[String(values.fuente)] ?? fuentes.sans ?? ''}
  font-size: ${values.tamano}px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;
  max-width: 560px;
  background: linear-gradient(${values.angulo}deg, ${values.color1}, ${values.color2});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}`;
    },
  },
};
