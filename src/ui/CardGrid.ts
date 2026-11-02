/**
 * Grid de contenido: chips de filtrado por motor + tarjetas de componentes.
 *
 * Las tarjetas son ESTÁTICAS: muestran icono de categoría, título, descripción
 * y etiquetas, pero NO renderizan el componente (ni iframes ni miniaturas).
 * Así la biblioteca no gasta recursos: el componente solo se ejecuta al abrir
 * el modal de personalización, que monta su propia vista previa aislada y la
 * descarga al cerrar.
 */
import type { CategoryId, CategoryMeta, UIComponentItem } from '../types/component.js';
import type { EngineFilter } from '../types/engine.js';
import { engines, engineList } from '../engines/index.js';

export interface CardGridHandlers {
  onEngineFilter(engine: EngineFilter): void;
  onOpenComponent(componentId: string): void;
  onClearFilters(): void;
}

export interface EmptyInfo {
  title: string;
  message: string;
}

/** Glifo SVG (stroke, viewBox 24) por categoría para la cabecera de tarjeta. */
const CATEGORY_GLYPHS: Record<CategoryId, string> = {
  botones: '<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  navegacion: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  graficos: '<path d="M6 20v-8M12 20V6M18 20v-5"/>',
  iconos: '<path d="m12 4 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.3l5-.7z"/>',
  formularios: '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 12h6"/>',
  tarjetas: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18"/>',
  utilidades: '<path d="M5 6h14M5 12h14M5 18h14"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  textos: '<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
  layout: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 4v16M4 12h6"/>',
};

/** Tinte decorativo por categoría (solo estético, ignora el tema). */
const CATEGORY_TINTS: Record<CategoryId, string> = {
  botones: '#f7768e',
  navegacion: '#7aa2ff',
  graficos: '#6ee7b7',
  iconos: '#e0af68',
  formularios: '#b18cff',
  tarjetas: '#4fd6e0',
  utilidades: '#9ece6a',
  textos: '#ff9e64',
  layout: '#7dcfff',
};

function categoryGlyph(category: CategoryId): string {
  const glyph = CATEGORY_GLYPHS[category] ?? CATEGORY_GLYPHS.layout;
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg>`;
}

export class CardGrid {
  private readonly root: HTMLElement;
  private readonly handlers: CardGridHandlers;
  private readonly categories: Record<CategoryId, CategoryMeta>;
  private engineFilter: EngineFilter = 'todos';

  constructor(
    root: HTMLElement,
    categories: Record<CategoryId, CategoryMeta>,
    handlers: CardGridHandlers,
  ) {
    this.root = root;
    this.categories = categories;
    this.handlers = handlers;
  }

  /** Redibuja chips + contador + tarjetas (o estado vacío). */
  render(items: UIComponentItem[], engineFilter: EngineFilter, empty: EmptyInfo): void {
    this.engineFilter = engineFilter;
    this.root.innerHTML = '';

    this.root.appendChild(this.buildFilters());
    this.root.appendChild(this.buildCount(items.length));

    if (items.length === 0) {
      this.root.appendChild(this.buildEmpty(empty));
      return;
    }

    this.root.appendChild(this.buildGrid(items));
  }

  /** Fila de chips: "Todos" + un chip por motor (con estado). */
  private buildFilters(): HTMLElement {
    const filters = document.createElement('div');
    filters.className = 'filters';
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filtrar por motor');

    const all = document.createElement('button');
    all.type = 'button';
    all.className = this.engineFilter === 'todos' ? 'filter-chip is-active' : 'filter-chip';
    all.textContent = 'Todos los motores';
    all.addEventListener('click', () => this.handlers.onEngineFilter('todos'));
    filters.appendChild(all);

    for (const engine of engineList) {
      const chip = document.createElement('button');
      chip.type = 'button';
      const active = this.engineFilter === engine.meta.id;
      const future = engine.meta.status === 'futuro';
      chip.className = `filter-chip${active ? ' is-active' : ''}${future ? ' is-futuro' : ''}`;
      chip.title = `${engine.meta.description} (${engine.meta.tools})`;

      const dot = document.createElement('span');
      dot.className = 'dot';
      const name = document.createElement('span');
      name.textContent = engine.meta.short;
      chip.append(dot, name);

      if (future) {
        const pronto = document.createElement('span');
        pronto.className = 'pronto';
        pronto.textContent = 'pronto';
        chip.appendChild(pronto);
      }

      chip.addEventListener('click', () => this.handlers.onEngineFilter(engine.meta.id));
      filters.appendChild(chip);
    }

    return filters;
  }

  private buildCount(count: number): HTMLElement {
    const line = document.createElement('p');
    line.className = 'results-line';
    line.textContent = `${count} ${count === 1 ? 'componente' : 'componentes'}`;
    return line;
  }

  private buildGrid(items: UIComponentItem[]): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    for (const item of items) {
      grid.appendChild(this.buildCard(item));
    }
    return grid;
  }

  /** Tarjeta ESTÁTICA: sin iframe ni ejecución del componente (cero recursos). */
  private buildCard(item: UIComponentItem): HTMLElement {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Abrir ${item.name}`);

    // Cabecera decorativa: glifo de categoría + etiqueta de la categoría.
    const banner = document.createElement('div');
    banner.className = 'card-banner';
    banner.style.setProperty('--cat-tint', CATEGORY_TINTS[item.category] ?? '#7aa2ff');

    const glyph = document.createElement('span');
    glyph.className = 'card-glyph';
    glyph.innerHTML = categoryGlyph(item.category);

    const bannerLabel = document.createElement('span');
    bannerLabel.className = 'card-banner-label';
    const catMeta = this.categories[item.category];
    bannerLabel.textContent = catMeta ? catMeta.label : item.category;

    banner.append(glyph, bannerLabel);

    // Cuerpo: título, descripción y meta (motor + etiquetas de búsqueda).
    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.name;

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = item.description;

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const engineChip = document.createElement('span');
    engineChip.className = 'chip chip-engine';
    engineChip.title = engines[item.engine].meta.description;
    engineChip.textContent = engines[item.engine].meta.short;
    meta.appendChild(engineChip);

    for (const tag of (item.tags ?? []).slice(0, 3)) {
      const tagChip = document.createElement('span');
      tagChip.className = 'tag-chip';
      tagChip.textContent = `#${tag}`;
      meta.appendChild(tagChip);
    }

    body.append(title, desc, meta);
    card.append(banner, body);

    card.addEventListener('click', () => this.handlers.onOpenComponent(item.id));
    card.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.handlers.onOpenComponent(item.id);
      }
    });

    return card;
  }

  private buildEmpty(info: EmptyInfo): HTMLElement {
    const empty = document.createElement('div');
    empty.className = 'empty';

    const title = document.createElement('h3');
    title.textContent = info.title;
    const message = document.createElement('p');
    message.textContent = info.message;

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'btn-clear';
    clear.textContent = 'Limpiar filtros';
    clear.addEventListener('click', () => this.handlers.onClearFilters());

    empty.append(title, message, clear);
    return empty;
  }
}