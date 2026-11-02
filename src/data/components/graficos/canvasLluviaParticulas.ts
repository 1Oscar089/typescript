/**
 * Componente CANVAS de ejemplo: lluvia de partículas animada.
 * Motor: 'canvas' (HTML5 Canvas 2D). Categoría: gráficos.
 *
 * Demuestra un componente con bucle de animación (requestAnimationFrame) y
 * valores del panel de configuración "horneados" como literales en el JS
 * generado, de modo que el código copiado funcione de forma autónoma.
 */
import type { UIComponentItem } from '../../../types/component.js';

export const canvasLluviaParticulas: UIComponentItem = {
  id: 'canvas-lluvia-particulas',
  name: 'Lluvia de partículas',
  description:
    'Simulación 2D píxel a píxel sobre <canvas>: cantidad, velocidad, tamaño y color de las gotas configurables en vivo.',
  tags: ['partículas', 'animación', 'canvas', '2d', 'simulación'],
  category: 'graficos',
  engine: 'canvas',
  controls: [
    { key: 'cantidad', label: 'Partículas', type: 'range', defaultValue: 120, min: 20, max: 300, step: 10 },
    { key: 'velocidad', label: 'Velocidad', type: 'range', defaultValue: 4, min: 1, max: 10, step: 0.5 },
    { key: 'tamano', label: 'Radio base (px)', type: 'range', defaultValue: 2, min: 1, max: 6, step: 0.5 },
    { key: 'color', label: 'Color de las gotas', type: 'color', defaultValue: '#7aa2ff' },
  ],

  template: {
    html: () => `<div class="lluvia-escenario">
  <canvas class="lluvia-particulas" width="480" height="320"></canvas>
</div>`,

    css: () => `.lluvia-escenario {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.lluvia-particulas { display: block; background: #0b0e14; }`,

    js: (values) => `const canvas = document.querySelector('.lluvia-particulas');
const ctx = canvas.getContext('2d');

const CONFIG = {
  cantidad: ${values.cantidad},
  velocidad: ${values.velocidad},
  tamano: ${values.tamano},
  color: '${values.color}',
};

const particulas = Array.from({ length: CONFIG.cantidad }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: CONFIG.tamano * (0.5 + Math.random()),
  v: CONFIG.velocidad * (0.4 + Math.random() * 0.8),
}));

function cuadro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = CONFIG.color;

  for (const particula of particulas) {
    particula.y += particula.v;
    if (particula.y - particula.r > canvas.height) {
      particula.y = -particula.r;
      particula.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.arc(particula.x, particula.y, particula.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(cuadro);
}

cuadro();`,
  },
};
