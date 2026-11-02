/**
 * Tipos globales de los MOTORES de renderizado.
 *
 * La aplicación es multi-motor: la lógica central (core/generator) delega en
 * un RenderingEngine concreto (patrón Strategy) según la naturaleza del
 * componente seleccionado en el registro central (data/componentsData).
 *
 * Motores = "formas de crear objetos en la web", más allá de CSS y SVG.
 */
import type { ComponentValues, UIComponentItem } from './component.js';

/** Motores soportados por el sistema. */
export type EngineId = 'dom' | 'svg' | 'canvas' | 'webgl' | 'webxr' | 'game' | 'wasm';

/** Filtro de motor usado por la interfaz ('todos' = sin filtrar). */
export type EngineFilter = EngineId | 'todos';

/** Madurez del motor: 'activo' (operativo) o 'futuro' (en preparación). */
export type EngineStatus = 'activo' | 'futuro';

/** Metadatos que describen un motor para la interfaz. */
export interface EngineMeta {
  id: EngineId;
  /** Nombre completo, p. ej. 'Motor Canvas 2D'. */
  name: string;
  /** Etiqueta corta para chips/badges, p. ej. 'Canvas'. */
  short: string;
  description: string;
  /** Herramientas asociadas, p. ej. 'Fabric.js · Konva.js'. */
  tools: string;
  status: EngineStatus;
}

/** Lenguajes de código que los motores pueden emitir. */
export type CodeLang = 'html' | 'css' | 'js';

/** Bloque de código listo para previsualizar y copiar. */
export interface CodeBlock {
  lang: CodeLang;
  label: string;
  code: string;
}

/** Contexto que el orquestador (core/generator) entrega al motor elegido. */
export interface EngineContext {
  /** Componente seleccionado del registro central. */
  component: UIComponentItem;
  /** Valores actuales del panel de configuración. */
  values: ComponentValues;
}

/** Contrato del patrón Strategy: todo motor debe implementar `render`. */
export interface RenderingEngine {
  readonly meta: EngineMeta;
  /** Recibe el componente + valores y devuelve los bloques de código generados. */
  render(context: EngineContext): CodeBlock[];
}
