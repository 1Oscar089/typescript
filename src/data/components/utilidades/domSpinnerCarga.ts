/**
 * Componente DOM de ejemplo: indicador de carga 100% CSS (anillo o puntos).
 * Motor: 'dom'. Categoría: utilidades.
 *
 * Demuestra un control 'select' que cambia por completo el markup y el CSS
 * generados (dos variantes del mismo componente).
 */
import type { UIComponentItem } from '../../../types/component.js';

/** Redondea a 2 decimales para evitar valores como 11.200000000000001. */
function n(value: number): number {
  return Math.round(value * 100) / 100;
}

export const domSpinnerCarga: UIComponentItem = {
  id: 'dom-spinner-carga',
  name: 'Indicador de carga',
  description:
    'Spinner 100% CSS con dos variantes (anillo giratorio o puntos rebotando): tamaño, color y velocidad configurables.',
  tags: ['loader', 'spinner', 'carga', 'espera', 'css'],
  category: 'utilidades',
  engine: 'dom',
  controls: [
    {
      key: 'tipo',
      label: 'Variante',
      type: 'select',
      defaultValue: 'anillo',
      options: [
        { value: 'anillo', label: 'Anillo giratorio' },
        { value: 'puntos', label: 'Puntos rebotando' },
      ],
    },
    { key: 'tamano', label: 'Tamaño (px)', type: 'range', defaultValue: 56, min: 24, max: 120, step: 4 },
    { key: 'color', label: 'Color', type: 'color', defaultValue: '#6ee7b7' },
    { key: 'velocidad', label: 'Velocidad (x)', type: 'range', defaultValue: 1, min: 0.4, max: 2.5, step: 0.1 },
  ],

  template: {
    html: (values) =>
      values.tipo === 'puntos'
        ? `<div class="spinner spinner--puntos" role="status" aria-label="Cargando">
  <span></span><span></span><span></span>
</div>`
        : `<div class="spinner spinner--anillo" role="status" aria-label="Cargando"></div>`,

    css: (values) => {
      const tamano = Number(values.tamano);
      const duracion = n(1.1 / Number(values.velocidad));
      const color = String(values.color);

      const anillo = `.spinner--anillo {
  width: ${tamano}px;
  height: ${tamano}px;
  border-radius: 50%;
  border: ${Math.max(3, n(tamano * 0.09))}px solid ${color}33;
  border-top-color: ${color};
  animation: spinner-girar ${duracion}s linear infinite;
}`;

      const puntos = `.spinner--puntos {
  display: flex;
  gap: ${n(tamano * 0.16)}px;
}
.spinner--puntos span {
  width: ${n(tamano * 0.22)}px;
  height: ${n(tamano * 0.22)}px;
  border-radius: 50%;
  background: ${color};
  animation: spinner-rebotar ${duracion}s ease-in-out infinite;
}
.spinner--puntos span:nth-child(2) { animation-delay: ${n(duracion * 0.15)}s; }
.spinner--puntos span:nth-child(3) { animation-delay: ${n(duracion * 0.3)}s; }`;

      return `.spinner { display: inline-block; }
${values.tipo === 'puntos' ? puntos : anillo}

@keyframes spinner-girar { to { transform: rotate(360deg); } }

@keyframes spinner-rebotar {
  0%, 100% { transform: translateY(0); opacity: 0.55; }
  50% { transform: translateY(-${n(tamano * 0.25)}px); opacity: 1; }
}`;
    },
  },
};
