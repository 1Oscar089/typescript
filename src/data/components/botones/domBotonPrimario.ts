/**
 * Componente DOM: botón principal (CTA) en tres variantes.
 * Motor: 'dom'. Categoría: botones.
 *
 * Demuestra el control tipo 'radio' (sólido / contorno / degradado), que
 * cambia por completo la apariencia generada.
 */
import type { ComponentValues, UIComponentItem } from '../../../types/component.js';

const SIZES: Record<string, string> = { sm: '7px 18px', md: '11px 26px', lg: '15px 34px' };
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

export const domBotonPrimario: UIComponentItem = {
  id: 'dom-boton-primario',
  name: 'Botón principal',
  description:
    'CTA en tres variantes (sólido, contorno o degradado) con animación de pulso al hacer clic. Color, redondeo y tamaño ajustables.',
  tags: ['cta', 'botón', 'acción', 'primary', 'degradado'],
  category: 'botones',
  engine: 'dom',
  controls: [
    { key: 'texto', label: 'Texto', type: 'text', defaultValue: 'Comenzar ahora', placeholder: 'Enviar' },
    {
      key: 'variante',
      label: 'Variante',
      type: 'radio',
      defaultValue: 'solido',
      options: [
        { value: 'solido', label: 'Sólido' },
        { value: 'contorno', label: 'Contorno' },
        { value: 'degradado', label: 'Degradado' },
      ],
    },
    { key: 'color', label: 'Color principal', type: 'color', defaultValue: '#7aa2ff' },
    { key: 'color2', label: 'Color secundario', type: 'color', defaultValue: '#b18cff', hint: 'Solo se usa en la variante degradado.' },
    { key: 'radio', label: 'Redondeo (px)', type: 'range', defaultValue: 12, min: 0, max: 30, step: 1 },
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
  ],

  template: {
    html: (values: ComponentValues): string =>
      `<button class="btn-primario btn-primario--${String(values.variante)}" type="button">${esc(String(values.texto))}</button>`,

    css: (values: ComponentValues): string => {
      const padding = SIZES[String(values.tamano)] ?? '11px 26px';
      const variantes: Record<string, string> = {
        solido: `  background: ${values.color};\n  color: #ffffff;\n  border: 1px solid transparent;`,
        contorno: `  background: transparent;\n  color: ${values.color};\n  border: 1.5px solid ${values.color};`,
        degradado: `  background: linear-gradient(135deg, ${values.color}, ${values.color2});\n  color: #ffffff;\n  border: 1px solid transparent;`,
      };

      return `.btn-primario {
  appearance: none;
${variantes[String(values.variante)] ?? variantes.solido ?? ''}
  border-radius: ${values.radio}px;
  padding: ${padding};
  font: 600 15px/1 "Segoe UI", system-ui, sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}
.btn-primario:hover { transform: translateY(-1px); filter: brightness(1.06); box-shadow: 0 6px 18px ${values.color}44; }
.btn-primario:active { transform: translateY(0) scale(0.97); }
.btn-primario.pulso { animation: btn-primario-pulso 0.3s ease; }
@keyframes btn-primario-pulso {
  0% { transform: scale(1); }
  50% { transform: scale(0.94); }
  100% { transform: scale(1); }
}`;
    },

    js: (): string => `const boton = document.querySelector('.btn-primario');
boton.addEventListener('click', () => {
  boton.classList.remove('pulso');
  void boton.offsetWidth; // reinicia la animación
  boton.classList.add('pulso');
});`,
  },
};
