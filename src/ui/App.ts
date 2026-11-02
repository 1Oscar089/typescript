/**
 * App: orquesta la interfaz del generador.
 *
 * Layout: header (marca + buscador por título/etiquetas + toggle de tema),
 * sidebar de categorías con opción "Todas", y contenido con filtrador por
 * motor + tarjetas estáticas (solo título, descripción y etiquetas: sin
 * iframes para no gastar recursos). El clic en una tarjeta abre el modal
 * de personalización (sliders, inputs, selects, radios, switches), que es
 * el ÚNICO sitio donde el componente se ejecuta (preview aislada + código
 * copiable) y cuya vista previa se descarga al cerrar.
 */
import { categories, categoryOrder, componentsRegistry } from '../data/componentsData.js';
import { engines } from '../engines/index.js';
import { defaultValues } from '../core/generator.js';
import type { CategoryFilter, ComponentValues } from '../types/component.js';
import type { EngineFilter } from '../types/engine.js';
import { Sidebar } from './Sidebar.js';
import { CardGrid } from './CardGrid.js';
import { ComponentModal } from './ComponentModal.js';
import type { EmptyInfo } from './CardGrid.js';

const THEME_KEY = 'gcui-theme';

const SHELL = `
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">UI</span>
      <div>
        <h1>Generador de Componentes UI</h1>
        <p class="brand-sub">Biblioteca viva · Registro + Strategy multi-motor</p>
      </div>
    </div>
    <div class="search-box">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="search" type="search" placeholder="Buscar por título o etiquetas..." aria-label="Buscar componentes por título o etiquetas" />
    </div>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Cambiar entre modo claro y oscuro" title="Modo claro / oscuro">
      <svg class="icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </header>
  <div class="layout">
    <aside class="panel panel--sidebar" id="sidebar"></aside>
    <main class="content" id="content"></main>
  </div>
  <div id="modal-root"></div>`;

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Falta el elemento #${id} en la interfaz.`);
  return element as T;
}

export class App {
  private query = '';
  private category: CategoryFilter = 'todas';
  private engineFilter: EngineFilter = 'todos';
  private selectedId = '';
  private readonly valuesById = new Map<string, ComponentValues>();

  private readonly sidebar: Sidebar;
  private readonly grid: CardGrid;
  private readonly modal: ComponentModal;

  constructor(root: HTMLElement) {
    root.innerHTML = SHELL;

    this.bindThemeToggle();

    // Buscador del header (título, descripción, etiquetas, categoría y motor).
    const search = requireElement<HTMLInputElement>('search');
    let searchTimer: number | undefined;
    search.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        this.query = search.value;
        this.update();
      }, 160);
    });

    this.sidebar = new Sidebar(
      requireElement('sidebar'),
      componentsRegistry,
      categories,
      categoryOrder,
      (category) => {
        this.category = category;
        this.update();
      },
    );

    this.grid = new CardGrid(requireElement('content'), categories, {
      onEngineFilter: (engine) => {
        this.engineFilter = engine;
        this.update();
      },
      onOpenComponent: (componentId) => this.openComponent(componentId),
      onClearFilters: () => {
        this.query = '';
        this.category = 'todas';
        this.engineFilter = 'todos';
        search.value = '';
        this.update();
      },
    });

    this.modal = new ComponentModal(requireElement('modal-root'), categories, {
      onChange: (values) => {
        this.valuesById.set(this.selectedId, values);
      },
    });

    this.update();
  }

  /** Aplica los tres filtros (búsqueda + categoría + motor) al registro. */
  private filtered(): typeof componentsRegistry {
    return componentsRegistry.filter(
      (item) =>
        this.matchesQuery(item) &&
        (this.category === 'todas' || item.category === this.category) &&
        (this.engineFilter === 'todos' || item.engine === this.engineFilter),
    );
  }

  /** Búsqueda AND por términos sobre título, descripción, etiquetas, categoría y motor. */
  private matchesQuery(item: (typeof componentsRegistry)[number]): boolean {
    const query = this.query.trim().toLowerCase();
    if (!query) return true;

    const haystack = [
      item.name,
      item.description,
      (item.tags ?? []).join(' '),
      categories[item.category].label,
      engines[item.engine].meta.name,
    ]
      .join(' ')
      .toLowerCase();

    return query.split(/\s+/).every((term) => haystack.includes(term));
  }

  /** Refresca sidebar y grid con el estado de filtros actual. */
  private update(): void {
    this.sidebar.setSelected(this.category);

    const items = this.filtered();
    this.grid.render(items, this.engineFilter, this.buildEmptyInfo(items.length));
  }

  /** Mensaje de estado vacío contextual según los filtros activos. */
  private buildEmptyInfo(count: number): EmptyInfo {
    if (count > 0) return { title: '', message: '' };

    const engineMeta = this.engineFilter === 'todos' ? null : engines[this.engineFilter].meta;
    if (engineMeta && engineMeta.status === 'futuro' && !this.query.trim() && this.category === 'todas') {
      return {
        title: `${engineMeta.name} en preparación`,
        message: `Todavía no hay componentes registrados para este motor. Herramientas previstas: ${engineMeta.tools}.`,
      };
    }
    if (this.query.trim()) {
      return {
        title: 'Sin resultados',
        message: `Ningún componente coincide con "${this.query.trim()}". Prueba con otro término o revisa los filtros.`,
      };
    }
    return {
      title: 'Sin componentes',
      message: 'No hay componentes que cumplan con la combinación de filtros actual.',
    };
  }

  /** Abre el modal de personalización de un componente. */
  private openComponent(componentId: string): void {
    const component = componentsRegistry.find((item) => item.id === componentId);
    if (!component) return;

    this.selectedId = componentId;
    if (!this.valuesById.has(componentId)) {
      this.valuesById.set(componentId, defaultValues(component));
    }
    const values = this.valuesById.get(componentId) ?? defaultValues(component);
    this.modal.open(component, values);
  }

  /** Alterna claro/oscuro y persiste la preferencia en localStorage. */
  private bindThemeToggle(): void {
    const button = requireElement<HTMLButtonElement>('theme-toggle');
    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // almacenamiento no disponible: el tema simplemente no persiste
      }
    });
  }
}