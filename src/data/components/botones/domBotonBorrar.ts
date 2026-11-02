/**
 * Componente DOM de ejemplo: botón de borrado con confirmación en dos pasos.
 * Motor: 'dom'. Categoría: botones.
 *
 * El primer clic "arma" el botón (muestra "¿seguro?"); si no hay segundo clic
 * en 2,2 s se desarma solo. Sirve de plantilla para nuevos componentes DOM.
 */
import type { ComponentValues, UIComponentItem } from '../../../types/component.js';

const SIZES: Record<string, string> = { sm: '7px 16px', md: '11px 24px', lg: '15px 32px' };
const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa texto introducido por el usuario antes de incrustarlo en el HTML. */
function esc(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

export const domBotonBorrar: UIComponentItem = {
  id: 'dom-boton-borrar',
  name: 'Botón de borrado',
  description:
    'Botón con confirmación en dos pasos: el primer clic lo arma ("¿seguro?") y el segundo ejecuta la acción. Sin confirmación, se desarma solo.',
  tags: ['cta', 'confirmación', 'destructivo', 'peligro'],
  category: 'botones',
  engine: 'dom',
  controls: [
    { key: 'texto', label: 'Texto del botón', type: 'text', defaultValue: 'Borrar', placeholder: 'Eliminar' },
    { key: 'color', label: 'Color principal', type: 'color', defaultValue: '#e5484d' },
    { key: 'radio', label: 'Redondeo (px)', type: 'range', defaultValue: 10, min: 0, max: 28, step: 1 },
    {
      key: 'tamano',
      label: 'Tamaño',
      type: 'select',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Pequeño' },
        { value: 'md', label: 'Mediano' },
        { value: 'lg', label: 'Grande' },
      ],
    },
    { key: 'animar', label: 'Animación al armar', type: 'checkbox', defaultValue: true },
  ],

  template: {
    html: (values: ComponentValues): string =>
      `<button class="btn-borrar" type="button">${esc(String(values.texto))}</button>`,

    css: (values: ComponentValues): string => {
      const padding = SIZES[String(values.tamano)] ?? '11px 24px';
      const animacion = values.animar
        ? '\n.btn-borrar.armado { animation: btn-borrar-latido 0.35s ease; }'
        : '';

      return `.btn-borrar {
  appearance: none;
  border: 1px solid transparent;
  border-radius: ${values.radio}px;
  padding: ${padding};
  background: ${values.color};
  color: #ffffff;
  font: 600 15px/1 "Segoe UI", system-ui, sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
}
.btn-borrar:hover { filter: brightness(1.08); transform: translateY(-1px); }
.btn-borrar:active { transform: translateY(0) scale(0.97); }
.btn-borrar.armado {
  background: #14161c;
  border-color: ${values.color};
  box-shadow: 0 0 0 3px ${values.color}55;
}
.btn-borrar.armado::after { content: " ¿seguro?"; font-weight: 500; opacity: 0.85; }${animacion}
@keyframes btn-borrar-latido {
  0% { transform: scale(1); }
  40% { transform: scale(1.08); }
  100% { transform: scale(1); }
}`;
    },

    js: (): string => `const boton = document.querySelector('.btn-borrar');
let armado = false;
let temporizador = null;

boton.addEventListener('click', () => {
  if (!armado) {
    armado = true;
    boton.classList.add('armado');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      armado = false;
      boton.classList.remove('armado');
    }, 2200);
    return;
  }
  clearTimeout(temporizador);
  boton.disabled = true;
  boton.textContent = '¡Borrado!';
  console.log('[dom-boton-borrar] acción de borrado confirmada');
});`,
  },
};
