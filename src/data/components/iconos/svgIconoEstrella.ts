/**
 * Componente SVG de ejemplo: icono de estrella.
 * Motor: 'svg'. Categoría: iconos.
 *
 * Demuestra un 'checkbox' que alterna entre contorno y relleno sólido,
 * junto a los controles clásicos de tamaño, color y grosor de trazo.
 */
import type { UIComponentItem } from '../../../types/component.js';

export const svgIconoEstrella: UIComponentItem = {
  id: 'svg-icono-estrella',
  name: 'Icono estrella',
  description:
    'Estrella vectorial SVG con relleno conmutable (contorno o sólido): tamaño, color y grosor de trazo configurables.',
  tags: ['icono', 'estrella', 'favorito', 'rating', 'vector'],
  category: 'iconos',
  engine: 'svg',
  controls: [
    { key: 'tamano', label: 'Tamaño (px)', type: 'range', defaultValue: 48, min: 16, max: 120, step: 2 },
    { key: 'color', label: 'Color', type: 'color', defaultValue: '#ffc861' },
    { key: 'trazo', label: 'Grosor de trazo', type: 'range', defaultValue: 1.6, min: 0.8, max: 3.2, step: 0.1 },
    { key: 'relleno', label: 'Relleno sólido', type: 'checkbox', defaultValue: false },
  ],

  template: {
    html: (values) => {
      const fill = values.relleno ? String(values.color) : 'none';
      return `<svg
  class="icono-estrella"
  width="${values.tamano}"
  height="${values.tamano}"
  viewBox="0 0 24 24"
  fill="${fill}"
  stroke="${values.color}"
  stroke-width="${values.trazo}"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Icono de estrella">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
</svg>`;
    },
  },
};
