/**
 * REGISTRO CENTRAL de componentes ('componentsRegistry').
 *
 * Para dar de alta un componente nuevo:
 *   1. Crea su archivo en data/components/<categoría>/ (p. ej. botones/).
 *   2. Expórtalo aquí y añádelo al array `componentsRegistry`.
 * El resto de la aplicación (sidebar, buscador, tarjetas, modal, motores) lo
 * detecta automáticamente, sin tocar nada más.
 */
import type { CategoryId, CategoryMeta, UIComponentItem } from '../types/component.js';

import { domBotonBorrar } from './components/botones/domBotonBorrar.js';
import { domBotonPrimario } from './components/botones/domBotonPrimario.js';
import { domNavbar } from './components/navegacion/domNavbar.js';
import { canvasLluviaParticulas } from './components/graficos/canvasLluviaParticulas.js';
import { webglCubo3D } from './components/graficos/webglCubo3D.js';
import { svgIconoBasurero } from './components/iconos/svgIconoBasurero.js';
import { svgIconoEstrella } from './components/iconos/svgIconoEstrella.js';
import { svgIconoUsuario } from './components/iconos/svgIconoUsuario.js';
import { domCampoTexto } from './components/formularios/domCampoTexto.js';
import { domTarjetaPerfil } from './components/tarjetas/domTarjetaPerfil.js';
import { domSpinnerCarga } from './components/utilidades/domSpinnerCarga.js';
import { domTituloGradiente } from './components/textos/domTituloGradiente.js';
import { domSeparador } from './components/layout/domSeparador.js';

/** Metadatos de las categorías (etiquetas del sidebar). */
export const categories: Record<CategoryId, CategoryMeta> = {
  botones: { id: 'botones', label: 'Botones' },
  navegacion: { id: 'navegacion', label: 'Navegación' },
  graficos: { id: 'graficos', label: 'Gráficos' },
  iconos: { id: 'iconos', label: 'Iconos' },
  formularios: { id: 'formularios', label: 'Formularios' },
  tarjetas: { id: 'tarjetas', label: 'Tarjetas' },
  utilidades: { id: 'utilidades', label: 'Utilidades' },
  textos: { id: 'textos', label: 'Textos' },
  layout: { id: 'layout', label: 'Layout' },
};

/** Orden de carpetas/categorías en el sidebar. */
export const categoryOrder: CategoryId[] = [
  'botones',
  'navegacion',
  'graficos',
  'iconos',
  'formularios',
  'tarjetas',
  'utilidades',
  'textos',
  'layout',
];

/** Registro central: la biblioteca viva de componentes parametrizables. */
export const componentsRegistry: UIComponentItem[] = [
  domBotonPrimario,
  domBotonBorrar,
  domNavbar,
  canvasLluviaParticulas,
  webglCubo3D,
  svgIconoBasurero,
  svgIconoEstrella,
  svgIconoUsuario,
  domCampoTexto,
  domTarjetaPerfil,
  domSpinnerCarga,
  domTituloGradiente,
  domSeparador,
];