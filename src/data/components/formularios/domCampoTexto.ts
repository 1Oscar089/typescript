/**
 * Componente DOM: campo de texto con etiqueta y mensaje de ayuda.
 * Motor: 'dom'. Categoría: formularios.
 *
 * Demuestra el control 'radio' aplicado a estados (normal, error, éxito)
 * que cambian el borde y el mensaje del campo.
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

const AYUDA: Record<string, string> = {
  normal: 'Introduce un valor válido.',
  error: 'Este campo es obligatorio.',
  exito: '¡Se ve bien!',
};

export const domCampoTexto: UIComponentItem = {
  id: 'dom-campo-texto',
  name: 'Campo de texto',
  description:
    'Input de formulario con etiqueta, marcador y estados (normal, error, éxito) que colorean borde y mensaje de ayuda.',
  tags: ['input', 'formulario', 'campo', 'texto', 'validación'],
  category: 'formularios',
  engine: 'dom',
  controls: [
    { key: 'etiqueta', label: 'Etiqueta', type: 'text', defaultValue: 'Correo electrónico', placeholder: 'Nombre' },
    { key: 'placeholder', label: 'Marcador (placeholder)', type: 'text', defaultValue: 'tu@correo.com', placeholder: 'Escribe...' },
    {
      key: 'estado',
      label: 'Estado',
      type: 'radio',
      defaultValue: 'normal',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'error', label: 'Error' },
        { value: 'exito', label: 'Éxito' },
      ],
    },
    { key: 'ancho', label: 'Ancho (px)', type: 'range', defaultValue: 320, min: 220, max: 480, step: 10 },
    { key: 'radio', label: 'Redondeo (px)', type: 'range', defaultValue: 10, min: 0, max: 18, step: 1 },
  ],

  template: {
    html: (values: ComponentValues): string => {
      const ayuda = AYUDA[String(values.estado)] ?? AYUDA.normal ?? '';
      return `<div class="campo campo--${String(values.estado)}" style="max-width:${values.ancho}px">
  <label class="campo-etiqueta" for="campo-generado">${esc(String(values.etiqueta))}</label>
  <input class="campo-input" id="campo-generado" type="text" placeholder="${esc(String(values.placeholder))}" />
  <p class="campo-ayuda">${ayuda}</p>
</div>`;
    },

    css: (values: ComponentValues): string => {
      const estados: Record<string, string> = {
        normal: `.campo--normal .campo-input { border-color: #3a4356; }
.campo--normal .campo-input:focus { border-color: #7aa2ff; }
.campo--normal .campo-ayuda { color: #94a0b8; }`,
        error: `.campo--error .campo-input { border-color: #ff6b6b; }
.campo--error .campo-input:focus { border-color: #ff6b6b; box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.18); }
.campo--error .campo-ayuda { color: #ff6b6b; }`,
        exito: `.campo--exito .campo-input { border-color: #6ee7b7; }
.campo--exito .campo-input:focus { border-color: #6ee7b7; box-shadow: 0 0 0 3px rgba(110, 231, 183, 0.16); }
.campo--exito .campo-ayuda { color: #6ee7b7; }`,
      };

      return `.campo { width: 100%; font-family: "Segoe UI", system-ui, sans-serif; }
.campo-etiqueta {
  display: block;
  margin-bottom: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #e7ebf4;
}
.campo-input {
  width: 100%;
  padding: 11px 14px;
  border-radius: ${values.radio}px;
  border: 1px solid #3a4356;
  background: #141922;
  color: #e7ebf4;
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.campo-input::placeholder { color: #5d6b85; }
.campo-ayuda { margin: 7px 2px 0; font-size: 12px; }
${estados[String(values.estado)] ?? estados.normal ?? ''}`;
    },
  },
};
