/**
 * Componente DOM: tarjeta de perfil con avatar de iniciales.
 * Motor: 'dom'. Categoría: tarjetas.
 *
 * Demuestra alineación vía 'radio', sombra vía 'checkbox' y un botón con
 * estado (Seguir / Siguiendo) enlazado con JS.
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

/** Calcula las iniciales (máximo 2) a partir del nombre. */
function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join('');
}

export const domTarjetaPerfil: UIComponentItem = {
  id: 'dom-tarjeta-perfil',
  name: 'Tarjeta de perfil',
  description:
    'Card de usuario con avatar de iniciales, nombre, rol y botón "Seguir": acento, alineación, redondeo y sombra configurables.',
  tags: ['card', 'perfil', 'usuario', 'equipo', 'avatar'],
  category: 'tarjetas',
  engine: 'dom',
  controls: [
    { key: 'nombre', label: 'Nombre', type: 'text', defaultValue: 'Ada Lovelace', placeholder: 'Nombre completo' },
    { key: 'rol', label: 'Rol', type: 'text', defaultValue: 'Ingeniera de software', placeholder: 'Puesto' },
    { key: 'acento', label: 'Color de acento', type: 'color', defaultValue: '#7aa2ff' },
    {
      key: 'alineacion',
      label: 'Alineación',
      type: 'radio',
      defaultValue: 'centro',
      options: [
        { value: 'izquierda', label: 'Izquierda' },
        { value: 'centro', label: 'Centro' },
      ],
    },
    { key: 'radio', label: 'Redondeo (px)', type: 'range', defaultValue: 16, min: 0, max: 26, step: 1 },
    { key: 'sombra', label: 'Mostrar sombra', type: 'checkbox', defaultValue: true },
  ],

  template: {
    html: (values: ComponentValues): string => `<article class="tarjeta tarjeta--${String(values.alineacion)}${values.sombra ? ' tarjeta--sombra' : ''}" style="border-radius:${values.radio}px">
  <span class="tarjeta-avatar">${iniciales(String(values.nombre))}</span>
  <h3 class="tarjeta-nombre">${esc(String(values.nombre))}</h3>
  <p class="tarjeta-rol">${esc(String(values.rol))}</p>
  <button class="tarjeta-boton" type="button">Seguir</button>
</article>`,

    css: (values: ComponentValues): string => `.tarjeta {
  width: 260px;
  padding: 26px 22px;
  background: #141922;
  border: 1px solid #232a38;
  font-family: "Segoe UI", system-ui, sans-serif;
  text-align: ${values.alineacion === 'izquierda' ? 'left' : 'center'};
}
.tarjeta--sombra { box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35); }
.tarjeta-avatar {
  display: inline-grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: ${values.acento};
  color: #0b0e14;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.tarjeta--centro .tarjeta-avatar { margin-inline: auto; }
.tarjeta-nombre { margin: 14px 0 0; font-size: 16.5px; color: #e7ebf4; }
.tarjeta-rol { margin: 4px 0 0; font-size: 13px; color: #94a0b8; }
.tarjeta-boton {
  margin-top: 16px;
  padding: 9px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: ${values.acento};
  color: #0b0e14;
  font: 600 13px/1 "Segoe UI", system-ui, sans-serif;
  cursor: pointer;
  transition: filter 0.15s ease, background 0.15s ease;
}
.tarjeta-boton:hover { filter: brightness(1.08); }
.tarjeta-boton.siguiendo { background: transparent; border-color: ${values.acento}; color: ${values.acento}; }`,

    js: (): string => `const boton = document.querySelector('.tarjeta-boton');
boton.addEventListener('click', () => {
  const siguiendo = boton.classList.toggle('siguiendo');
  boton.textContent = siguiendo ? 'Siguiendo' : 'Seguir';
});`,
  },
};
