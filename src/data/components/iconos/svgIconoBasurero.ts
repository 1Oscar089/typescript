/**
 * Componente SVG de ejemplo: icono de basurero vectorial nativo.
 * Motor: 'svg'. Categoría: iconos.
 *
 * Demuestra cómo parametrizar atributos del propio <svg> (tamaño, color,
 * grosor de trazo) desde el panel de configuración.
 */
import type { UIComponentItem } from '../../../types/component.js';

export const svgIconoBasurero: UIComponentItem = {
  id: 'svg-icono-basurero',
  name: 'Icono basurero',
  description: 'Icono vectorial SVG nativo con control de tamaño, color de trazo y grosor de línea.',
  tags: ['icono', 'vector', 'papelera', 'trash', 'eliminar'],
  category: 'iconos',
  engine: 'svg',
  controls: [
    { key: 'tamano', label: 'Tamaño (px)', type: 'range', defaultValue: 48, min: 16, max: 120, step: 2 },
    { key: 'color', label: 'Color de trazo', type: 'color', defaultValue: '#ff6b6b' },
    { key: 'trazo', label: 'Grosor de trazo', type: 'range', defaultValue: 1.8, min: 0.8, max: 3.2, step: 0.1 },
  ],

  template: {
    html: (values) => `<svg
  class="icono-basurero"
  width="${values.tamano}"
  height="${values.tamano}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="${values.color}"
  stroke-width="${values.trazo}"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Icono de basurero">
  <path d="M3 6h18" />
  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  <path d="M10 11v6" />
  <path d="M14 11v6" />
</svg>`,
  },
};
