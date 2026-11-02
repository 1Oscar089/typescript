/**
 * Exportador de motores (Registro de estrategias, patrón Strategy).
 *
 * Motores = formas de crear objetos en la web:
 *   dom, svg, canvas y webgl están operativos; webxr, game y wasm quedan
 *   registrados como [futuro] con aviso visible hasta su integración.
 *
 * Para añadir un motor nuevo:
 *   1. Implementa RenderingEngine en su propio archivo dentro de /engines.
 *   2. Amplía el union EngineId en src/types/engine.ts.
 *   3. Regístralo en el objeto `engines` de este archivo.
 * La lógica central y la interfaz lo detectan automáticamente.
 */
import type { EngineId, RenderingEngine } from '../types/engine.js';

import { domEngine } from './domEngine.js';
import { svgEngine } from './svgEngine.js';
import { canvasEngine } from './canvasEngine.js';
import { webglEngine } from './webglEngine.js';
import { webxrEngine } from './webxrEngine.js';
import { gameEngine } from './gameEngine.js';
import { wasmEngine } from './wasmEngine.js';

/** Registro de motores disponible. */
export const engines: Record<EngineId, RenderingEngine> = {
  dom: domEngine,
  svg: svgEngine,
  canvas: canvasEngine,
  webgl: webglEngine,
  webxr: webxrEngine,
  game: gameEngine,
  wasm: wasmEngine,
};

/** Lista de motores en orden de registro, para el filtrador y las tarjetas. */
export const engineList: RenderingEngine[] = Object.values(engines);