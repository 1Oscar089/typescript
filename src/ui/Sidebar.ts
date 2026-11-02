/**
 * Sidebar izquierdo: lista de categorías del registro, con la opción "Todas"
 * al inicio y contadores por categoría.
 */
import type { CategoryFilter, CategoryId, CategoryMeta, UIComponentItem } from '../types/component.js';

export type SidebarSelectHandler = (category: CategoryFilter) => void;

export class Sidebar {
  private readonly nav: HTMLElement;
  private readonly onSelect: SidebarSelectHandler;
  private readonly categories: Record<CategoryId, CategoryMeta>;
  private readonly categoryOrder: CategoryId[];
  private readonly registry: UIComponentItem[];

  constructor(
    root: HTMLElement,
    registry: UIComponentItem[],
    categories: Record<CategoryId, CategoryMeta>,
    categoryOrder: CategoryId[],
    onSelect: SidebarSelectHandler,
  ) {
    this.onSelect = onSelect;
    this.registry = registry;
    this.categories = categories;
    this.categoryOrder = categoryOrder;

    root.innerHTML = `
      <div class="panel-head">
        <h2>Biblioteca</h2>
        <span class="side-total">${registry.length}</span>
      </div>
      <nav class="side-nav" aria-label="Categorías del registro"></nav>`;

    const nav = root.querySelector('.side-nav');
    if (!nav) throw new Error('No se pudo construir el sidebar.');
    this.nav = nav as HTMLElement;

    this.nav.addEventListener('click', (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest<HTMLElement>('[data-category]');
      const category = button?.dataset.category;
      if (category) this.onSelect(category as CategoryFilter);
    });

    this.renderList();
  }

  /** Marca la categoría activa ('todas' incluida) sin reconstruir la lista. */
  setSelected(category: CategoryFilter): void {
    for (const button of Array.from(this.nav.querySelectorAll<HTMLElement>('[data-category]'))) {
      button.classList.toggle('is-active', button.dataset.category === category);
    }
  }

  private renderList(): void {
    this.nav.innerHTML = '';

    this.nav.appendChild(this.buildItem('todas', 'Todas', this.registry.length));

    const separator = document.createElement('div');
    separator.className = 'side-sep';
    this.nav.appendChild(separator);

    for (const categoryId of this.categoryOrder) {
      const count = this.registry.filter((item) => item.category === categoryId).length;
      const meta = this.categories[categoryId];
      this.nav.appendChild(this.buildItem(categoryId, meta ? meta.label : categoryId, count));
    }
  }

  private buildItem(category: CategoryFilter, label: string, count: number): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'side-item';
    button.dataset.category = category;
    if (category === 'todas') button.classList.add('is-active');

    const name = document.createElement('span');
    name.textContent = label;
    const badge = document.createElement('span');
    badge.className = 'side-count';
    badge.textContent = String(count);

    button.append(name, badge);
    return button;
  }
}
