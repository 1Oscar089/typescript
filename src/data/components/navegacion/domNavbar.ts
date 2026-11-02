/**
 * Componente DOM: barra de navegación horizontal.
 * Motor: 'dom'. Categoría: navegación.
 *
 * Marca, color de acento, altura y separación de enlaces configurables,
 * con tres fondos (oscuro, claro o transparente) vía control 'radio'.
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

export const domNavbar: UIComponentItem = {
  id: 'dom-navbar',
  name: 'Barra de navegación',
  description:
    'Navbar horizontal con marca y enlaces: color de acento, altura, separación y fondo (oscuro, claro o transparente) configurables. El enlace activo se mueve al hacer clic.',
  tags: ['navbar', 'menú', 'header', 'enlaces', 'navegación'],
  category: 'navegacion',
  engine: 'dom',
  controls: [
    { key: 'marca', label: 'Texto de la marca', type: 'text', defaultValue: 'Mi Sitio', placeholder: 'Mi marca' },
    {
      key: 'fondo',
      label: 'Fondo',
      type: 'radio',
      defaultValue: 'oscuro',
      options: [
        { value: 'oscuro', label: 'Oscuro' },
        { value: 'claro', label: 'Claro' },
        { value: 'transparente', label: 'Transparente' },
      ],
    },
    { key: 'acento', label: 'Color de acento', type: 'color', defaultValue: '#7aa2ff' },
    { key: 'alto', label: 'Altura (px)', type: 'range', defaultValue: 64, min: 48, max: 92, step: 2 },
    { key: 'separacion', label: 'Separación de enlaces (px)', type: 'range', defaultValue: 18, min: 8, max: 40, step: 2 },
  ],

  template: {
    html: (values: ComponentValues): string => `<nav class="navbar navbar--${String(values.fondo)}">
  <a class="navbar-marca" href="#">${esc(String(values.marca))}</a>
  <div class="navbar-links">
    <a href="#" class="activo">Inicio</a>
    <a href="#">Componentes</a>
    <a href="#">Documentación</a>
    <a href="#">Contacto</a>
  </div>
</nav>`,

    css: (values: ComponentValues): string => {
      const fondos: Record<string, string> = {
        oscuro: `  background: #141922;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);`,
        claro: `  background: #ffffff;\n  box-shadow: inset 0 0 0 1px #e4e8f2;`,
        transparente: `  background: transparent;\n  box-shadow: inset 0 0 0 1px rgba(148, 160, 184, 0.35);`,
      };

      return `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  height: ${values.alto}px;
  padding: 0 22px;
  border-radius: 14px;
${fondos[String(values.fondo)] ?? fondos.oscuro ?? ''}
}
.navbar-marca {
  font-weight: 700;
  font-size: 16px;
  color: ${values.acento};
  text-decoration: none;
  letter-spacing: 0.01em;
}
.navbar-links { display: flex; gap: ${values.separacion}px; }
.navbar-links a {
  color: #94a0b8;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 2px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.navbar-links a:hover { color: ${values.acento}; }
.navbar-links a.activo { color: ${values.acento}; border-bottom-color: ${values.acento}; }`;
    },

    js: (): string => `const enlaces = document.querySelectorAll('.navbar-links a');
enlaces.forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();
    enlaces.forEach((otro) => otro.classList.remove('activo'));
    enlace.classList.add('activo');
  });
});`,
  },
};
