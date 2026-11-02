/**
 * Tipos globales de los COMPONENTES del registro.
 *
 * Un componente es una pieza de UI parametrizable: declara sus controles
 * (panel de configuración) y sus plantillas puras (html/css/js), y delega en
 * un motor (ver types/engine.ts) la construcción del código final.
 */
import type { EngineId } from './engine.js';

/** Valor individual producido por un control del panel de configuración. */
export type ComponentValue = string | number | boolean;

/** Mapa clave -> valor con la configuración actual de un componente. */
export type ComponentValues = Record<string, ComponentValue>;

/** Categorías del registro (espejo de src/data/components/). */
export type CategoryId =
  | 'botones'
  | 'navegacion'
  | 'graficos'
  | 'iconos'
  | 'formularios'
  | 'tarjetas'
  | 'utilidades'
  | 'textos'
  | 'layout';

/** Filtro de categoría usado por la interfaz ('todas' = sin filtrar). */
export type CategoryFilter = CategoryId | 'todas';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
}

/** Tipos de control soportados por el panel de configuración. */
export type UIControlType =
  | 'text'
  | 'number'
  | 'range'
  | 'color'
  | 'select'
  | 'radio'
  | 'checkbox';

/** Opción de un control tipo 'select' o 'radio'. */
export interface UIControlOption {
  value: string;
  label: string;
}

/** Definición declarativa de un control del panel de configuración. */
export interface UIControl {
  /** Clave con la que el valor se guarda en ComponentValues. */
  key: string;
  label: string;
  type: UIControlType;
  defaultValue: ComponentValue;
  min?: number;
  max?: number;
  step?: number;
  options?: UIControlOption[];
  placeholder?: string;
  hint?: string;
}

/** Plantillas puras del componente: funciones que devuelven código en texto. */
export interface ComponentTemplate {
  /** Markup principal (etiquetas HTML o el propio <svg>). */
  html?: (values: ComponentValues) => string;
  /** Estilos CSS encapsulados del componente. */
  css?: (values: ComponentValues) => string;
  /** Script JS que enlaza eventos / anima el componente. */
  js?: (values: ComponentValues) => string;
}

/** Elemento del REGISTRO CENTRAL de componentes (componentsRegistry). */
export interface UIComponentItem {
  /** Identificador único, p. ej. 'dom-boton-borrar'. */
  id: string;
  name: string;
  description: string;
  /** Etiquetas libres para el buscador del header. */
  tags?: string[];
  category: CategoryId;
  /** Motor que construirá el código (patrón Strategy). */
  engine: EngineId;
  /** Controles que pinta el panel de configuración (modal). */
  controls: UIControl[];
  /** Plantillas puras que consumen los motores. */
  template: ComponentTemplate;
}
