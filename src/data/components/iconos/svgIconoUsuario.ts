/**
 * Componente SVG: icono de usuario "todo en uno".
 * Motor: 'svg'. Categoría: iconos.
 *
 * Demuestra el catálogo completo de interacciones del registro:
 *  - Relleno en 3 modos: sin relleno (trazo), tinte suave o sólido.
 *  - 9 animaciones seleccionables (aparecer, latido, flotar, rebote,
 *    balanceo, girar, ping de anillo, brillo) con velocidad ajustable.
 *  - 8 comportamientos al hacer hover (escalar, salto, inclinar, agitar,
 *    girar, rellenar, brillar).
 *  - 6 respuestas al clic (pulsar, onda, girar, agitar, estallido), que
 *    aportan el bloque JavaScript solo cuando el usuario elige una.
 *  - Insignia circular opcional detrás del icono.
 */
import type { ComponentValues, UIComponentItem } from '../../../types/component.js';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa el texto del usuario (etiqueta accesible) antes de incrustarlo. */
function esc(texto: string): string {
  return texto.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

export const svgIconoUsuario: UIComponentItem = {
  id: 'svg-icono-usuario',
  name: 'Icono de usuario',
  description:
    'Icono de usuario SVG personalizable: relleno opcional (trazo, tinte o sólido), insignia circular y un catálogo de animaciones, efectos hover y respuestas al clic elegibles desde el panel.',
  tags: ['icono', 'usuario', 'avatar', 'perfil', 'persona', 'animación', 'hover', 'click'],
  category: 'iconos',
  engine: 'svg',

  controls: [
    { key: 'etiqueta', label: 'Texto alternativo', type: 'text', defaultValue: 'Usuario', placeholder: 'Avatar de Ana' },
    { key: 'tamano', label: 'Tamaño (px)', type: 'range', defaultValue: 56, min: 24, max: 140, step: 2 },
    { key: 'trazo', label: 'Grosor de trazo', type: 'range', defaultValue: 1.8, min: 0.6, max: 4, step: 0.2 },
    { key: 'color', label: 'Color', type: 'color', defaultValue: '#7aa2ff' },
    {
      key: 'relleno',
      label: 'Relleno',
      type: 'radio',
      defaultValue: 'ninguno',
      options: [
        { value: 'ninguno', label: 'Sin relleno' },
        { value: 'tinte', label: 'Tinte suave' },
        { value: 'solido', label: 'Sólido' },
      ],
    },
    { key: 'insignia', label: 'Insignia circular de fondo', type: 'checkbox', defaultValue: false },
    {
      key: 'animacion',
      label: 'Animación',
      type: 'select',
      defaultValue: 'ninguna',
      options: [
        { value: 'ninguna', label: 'Sin animación' },
        { value: 'aparecer', label: 'Aparecer (entrada)' },
        { value: 'latido', label: 'Latido' },
        { value: 'flotar', label: 'Flotar' },
        { value: 'rebote', label: 'Rebote' },
        { value: 'balanceo', label: 'Balanceo' },
        { value: 'girar', label: 'Girar' },
        { value: 'ping', label: 'Ping (anillo)' },
        { value: 'brillo', label: 'Brillo pulsante' },
      ],
    },
    { key: 'velocidad', label: 'Duración (s)', type: 'range', defaultValue: 1.6, min: 0.4, max: 3.2, step: 0.2, hint: 'Solo afecta a la animación continua elegida.' },
    {
      key: 'hover',
      label: 'Al pasar el ratón',
      type: 'select',
      defaultValue: 'ninguno',
      options: [
        { value: 'ninguno', label: 'Sin efecto' },
        { value: 'escalar', label: 'Escalar' },
        { value: 'salto', label: 'Salto' },
        { value: 'inclinar', label: 'Inclinar' },
        { value: 'agitar', label: 'Agitar' },
        { value: 'girar', label: 'Girar una vuelta' },
        { value: 'rellenar', label: 'Rellenar' },
        { value: 'brillar', label: 'Brillar' },
      ],
    },
    {
      key: 'click',
      label: 'Al hacer clic',
      type: 'select',
      defaultValue: 'ninguno',
      options: [
        { value: 'ninguno', label: 'Sin respuesta' },
        { value: 'pulsar', label: 'Pulsar' },
        { value: 'onda', label: 'Onda expansiva' },
        { value: 'girar', label: 'Girar una vuelta' },
        { value: 'agitar', label: 'Agitar' },
        { value: 'estallido', label: 'Estallido de chispas' },
      ],
    },
  ],

  template: {
    html: (values: ComponentValues): string => {
      const tamano = Number(values.tamano);
      return `<span class="icono-usuario" role="img" aria-label="${esc(String(values.etiqueta))}">
  <svg class="icono-usuario__svg" width="${tamano}" height="${tamano}" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <circle class="icono-usuario__forma" cx="12" cy="7.5" r="4" />
    <path class="icono-usuario__forma" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </svg>
</span>`;
    },

    css: (values: ComponentValues): string => {
      const color = String(values.color);
      const tamano = Number(values.tamano);
      const trazo = Number(values.trazo);
      const velocidad = Number(values.velocidad);
      const relleno = String(values.relleno);
      const animacion = String(values.animacion);
      const hover = String(values.hover);
      const click = String(values.click);
      const insignia = values.insignia === true;

      const fillOp = relleno === 'solido' ? '1' : relleno === 'tinte' ? '0.16' : '0';
      const pad = Math.round(tamano * 0.14);

      const partes: string[] = [];

      partes.push(`.icono-usuario {
  position: relative;
  display: inline-grid;
  place-items: center;
  padding: ${insignia ? `${pad}px` : '0'};
  border-radius: 50%;
  background: ${insignia ? `${color}1f` : 'transparent'};
  border: 1px solid ${insignia ? `${color}4d` : 'transparent'};
  cursor: ${click === 'ninguno' ? 'default' : 'pointer'};
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease, filter 0.3s ease;
}`);

      const animSvg: Record<string, string> = {
        aparecer: `iu-aparecer 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
        latido: `iu-latido ${velocidad}s ease-in-out infinite`,
        flotar: `iu-flotar ${velocidad}s ease-in-out infinite`,
        rebote: `iu-rebote ${velocidad}s infinite`,
        balanceo: `iu-balanceo ${velocidad}s ease-in-out infinite`,
        girar: `iu-giro ${(velocidad * 2).toFixed(1)}s linear infinite`,
      };
      const animacionSvg = animSvg[animacion] ?? '';

      partes.push(`.icono-usuario__svg {
  overflow: visible;
  transform-origin: center;${animacionSvg ? `\n  animation: ${animacionSvg};` : ''}
}`);

      partes.push(`.icono-usuario__forma {
  fill: ${color};
  fill-opacity: ${fillOp};
  stroke: ${color};
  stroke-width: ${trazo};
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: fill-opacity 0.25s ease;
}`);

      if (click !== 'ninguno') {
        partes.push(`.icono-usuario:focus-visible {
  outline: 2px solid ${color};
  outline-offset: 3px;
}`);
      }

      // --- Animación continua: ping (anillo) y brillo viven en el span ---
      if (animacion === 'ping') {
        partes.push(`.icono-usuario::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${color};
  pointer-events: none;
  animation: iu-ping ${velocidad}s ease-out infinite;
}`);
      }

      if (animacion === 'brillo') {
        partes.push(`.icono-usuario { animation: iu-brillo ${velocidad}s ease-in-out infinite; }`);
      }

      // --- Hover (CSS puro) ---
      if (hover === 'escalar') partes.push(`.icono-usuario:hover { transform: scale(1.12); }`);
      if (hover === 'salto') partes.push(`.icono-usuario:hover { transform: translateY(-5px); }`);
      if (hover === 'inclinar') partes.push(`.icono-usuario:hover { transform: rotate(-7deg); }`);
      if (hover === 'agitar') partes.push(`.icono-usuario:hover { animation: iu-agitar 0.45s ease; }`);
      if (hover === 'girar') partes.push(`.icono-usuario:hover .icono-usuario__svg { animation: iu-giro 0.8s ease; }`);
      if (hover === 'rellenar') partes.push(`.icono-usuario:hover .icono-usuario__forma { fill-opacity: 1; }`);
      if (hover === 'brillar') partes.push(`.icono-usuario:hover { filter: drop-shadow(0 0 10px ${color}); }`);

      // --- Click (clases que aplica el JS) ---
      if (click === 'pulsar') partes.push(`.icono-usuario.iu-pulsar { animation: iu-pulsar 0.32s ease; }`);
      if (click === 'agitar') partes.push(`.icono-usuario.iu-click-agitar { animation: iu-agitar 0.45s ease; }`);
      if (click === 'girar') partes.push(`.icono-usuario__svg.iu-giro { animation: iu-giro 0.8s ease; }`);

      if (click === 'onda') {
        partes.push(`.icono-usuario .iu-onda {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${color};
  pointer-events: none;
  animation: iu-onda 0.55s ease-out forwards;
}`);
      }

      if (click === 'estallido') {
        partes.push(`.icono-usuario .iu-chispa {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: ${color};
  pointer-events: none;
  transform: rotate(var(--iu-a)) translateY(0);
  animation: iu-chispa 0.6s ease-out forwards;
}`);
      }

      // --- Keyframes: solo se emiten los de las opciones elegidas ---
      const claves: string[] = [];

      if (animacion === 'aparecer') {
        claves.push(`@keyframes iu-aparecer {
  from { opacity: 0; transform: scale(0.55); }
  to { opacity: 1; transform: scale(1); }
}`);
      }
      if (animacion === 'latido') {
        claves.push(`@keyframes iu-latido {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.14); }
  45% { transform: scale(1.04); }
  60% { transform: scale(1.1); }
}`);
      }
      if (animacion === 'flotar') {
        claves.push(`@keyframes iu-flotar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9%); }
}`);
      }
      if (animacion === 'rebote') {
        claves.push(`@keyframes iu-rebote {
  0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.3, 0, 0.4, 1); }
  32% { transform: translateY(-28%); animation-timing-function: cubic-bezier(0.6, 0, 0.85, 0.5); }
  62% { transform: translateY(0); }
  74% { transform: translateY(-10%); }
  84% { transform: translateY(0); }
  91% { transform: translateY(-4%); }
}`);
      }
      if (animacion === 'balanceo') {
        claves.push(`@keyframes iu-balanceo {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}`);
      }
      if (animacion === 'girar' || hover === 'girar' || click === 'girar') {
        claves.push(`@keyframes iu-giro { to { transform: rotate(360deg); } }`);
      }
      if (animacion === 'ping') {
        claves.push(`@keyframes iu-ping {
  0% { transform: scale(0.85); opacity: 0.7; }
  70%, 100% { transform: scale(1.6); opacity: 0; }
}`);
      }
      if (animacion === 'brillo') {
        claves.push(`@keyframes iu-brillo {
  0%, 100% { filter: drop-shadow(0 0 2px ${color}); }
  50% { filter: drop-shadow(0 0 12px ${color}); }
}`);
      }
      if (hover === 'agitar' || click === 'agitar') {
        claves.push(`@keyframes iu-agitar {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}`);
      }
      if (click === 'pulsar') {
        claves.push(`@keyframes iu-pulsar {
  0% { transform: scale(1); }
  35% { transform: scale(0.82); }
  70% { transform: scale(1.08); }
  100% { transform: scale(1); }
}`);
      }
      if (click === 'onda') {
        claves.push(`@keyframes iu-onda {
  from { transform: scale(0.7); opacity: 0.8; }
  to { transform: scale(1.9); opacity: 0; }
}`);
      }
      if (click === 'estallido') {
        claves.push(`@keyframes iu-chispa {
  from { opacity: 1; transform: rotate(var(--iu-a)) translateY(0); }
  to { opacity: 0; transform: rotate(var(--iu-a)) translateY(-46px); }
}`);
      }

      return [...partes, ...claves].join('\n\n');
    },

    js: (values: ComponentValues): string => {
      const click = String(values.click);
      if (click === 'ninguno') return '';

      const cabecera = `const icono = document.querySelector('.icono-usuario');
const svg = icono.querySelector('svg');

// Relanza una animación aunque ya estuviera activa (truco del reflow).
const relanzar = (elemento, clase) => {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
};

// Limpieza: quita clases de animación terminadas y elementos efímeros.
icono.addEventListener('animationend', (evento) => {
  const objetivo = evento.target;
  if (objetivo === icono) {
    icono.classList.remove('iu-pulsar', 'iu-click-agitar');
  } else if (objetivo === svg) {
    svg.classList.remove('iu-giro');
  } else if (objetivo.classList.contains('iu-onda') || objetivo.classList.contains('iu-chispa')) {
    objetivo.remove();
  }
});

icono.addEventListener('click', () => {`;

      const cuerpos: Record<string, string> = {
        pulsar: `  relanzar(icono, 'iu-pulsar');`,
        agitar: `  relanzar(icono, 'iu-click-agitar');`,
        girar: `  relanzar(svg, 'iu-giro');`,
        onda: `  const onda = document.createElement('span');
  onda.className = 'iu-onda';
  icono.appendChild(onda);`,
        estallido: `  for (let i = 0; i < 8; i += 1) {
    const chispa = document.createElement('span');
    chispa.className = 'iu-chispa';
    chispa.style.setProperty('--iu-a', (i * 45) + 'deg');
    icono.appendChild(chispa);
  }`,
      };

      return `${cabecera}
${cuerpos[click] ?? ''}
});`;
    },
  },
};