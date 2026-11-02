/**
 * Motor 'game' [FUTURO]: motores de videojuegos con leyes físicas.
 * Gestión de múltiples objetos en pantalla con gravedad, colisiones y
 * rebotes controlados. Punto de extensión reservado para Phaser o PixiJS.
 */
import type { RenderingEngine } from '../types/engine.js';
import { createFutureEngine } from './futureEngine.js';

export const gameEngine: RenderingEngine = createFutureEngine({
  id: 'game',
  name: 'Motor de Videojuegos',
  short: 'Juegos',
  description: 'Objetos con leyes físicas: gravedad, colisiones y rebotes controlados en pantalla.',
  tools: 'Phaser (2D) · PixiJS (2D masivo)',
  status: 'futuro',
});
