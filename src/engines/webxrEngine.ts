/**
 * Motor 'webxr' [FUTURO]: realidad virtual y aumentada.
 * Creación de objetos e interiores interactivos en 3D compatibles con gafas
 * VR o cámaras de celular. Punto de extensión reservado para A-Frame.
 */
import type { RenderingEngine } from '../types/engine.js';
import { createFutureEngine } from './futureEngine.js';

export const webxrEngine: RenderingEngine = createFutureEngine({
  id: 'webxr',
  name: 'Motor WebXR',
  short: 'WebXR',
  description: 'Realidad virtual y aumentada: objetos e interiores 3D interactivos para gafas VR o cámaras de celular.',
  tools: 'A-Frame (etiquetas tipo HTML)',
  status: 'futuro',
});
