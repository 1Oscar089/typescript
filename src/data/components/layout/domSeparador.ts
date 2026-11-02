/**
 * Componente DOM: separador de secciones con texto central.
 * Motor: 'dom'. Categoría: layout.
 *
 * Demuestra el control 'radio' con tres estilos de línea (sólida, punteada
 * y degradada), además de grosor, margen y color.
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

export const domSeparador: UIComponentItem = {
  id: 'dom-separador',
  name: 'Separador de secciones',
  description:
    'Divisor horizontal con texto central y tres estilos de línea: sólida, punteada o degradada. Grosor, margen y color ajustables.',
  tags: ['divider', 'separador', 'hr', 'layout', 'sección'],
  category: 'layout',
  engine: 'dom',
  controls: [
    { key: 'texto', label: 'Texto central', type: 'text', defaultValue: 'Sección', placeholder: 'Capítulo 1' },
    {
      key: 'estilo',
      label: 'Estilo de línea',
      type: 'radio',
      defaultValue: 'solido',
      options: [
        { value: 'solido', label: 'Sólida' },
        { value: 'punteado', label: 'Punteada' },
        { value: 'degradado', label: 'Degradada' },
      ],
    },
    { key: 'color', label: 'Color', type: 'color', defaultValue: '#94a0b8' },
    { key: 'grosor', label: 'Grosor (px)', type: 'range', defaultValue: 2, min: 1, max: 6, step: 1 },
    { key: 'margen', label: 'Margen vertical (px)', type: 'range', defaultValue: 24, min: 8, max: 48, step: 2 },
  ],

  template: {
    html: (values: ComponentValues): string => `<div class="separador separador--${String(values.estilo)}" style="margin:${values.margen}px 0">
  <span class="separador-linea"></span>
  <span class="separador-texto">${esc(String(values.texto))}</span>
  <span class="separador-linea"></span>
</div>`,

    css: (values: ComponentValues): string => `.separador {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 420px;
  font-family: "Segoe UI", system-ui, sans-serif;
}
.separador-linea { flex: 1; }
.separador--solido .separador-linea { border-top: ${values.grosor}px solid ${values.color}; }
.separador--punteado .separador-linea { border-top: ${values.grosor}px dashed ${values.color}; }
.separador--degradado .separador-linea {
  height: ${values.grosor}px;
  background: linear-gradient(90deg, transparent, ${values.color}, transparent);
}
.separador-texto {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${values.color};
}`,
  },
};
