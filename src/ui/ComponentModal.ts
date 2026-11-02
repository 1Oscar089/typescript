/**
 * Modal de personalización: se abre al hacer clic en una tarjeta.
 *
 * Estructura: configuración completa a la izquierda (sliders, inputs,
 * selects, radios, switches, colores) y a la derecha vista previa aislada
 * + código generado con pestañas y copia al portapapeles.
 * El componente SOLO se ejecuta aquí: la vista previa se monta al abrir el
 * modal y se descarga al cerrarlo (srcdoc vacío) para no consumir recursos
 * (bucles rAF, listeners, canvas...) mientras el modal no está visible.
 * Se cierra con la X, con la tecla Esc o haciendo clic en el fondo.
 */
import type { CategoryId, CategoryMeta, ComponentValues, UIComponentItem } from '../types/component.js';
import type { CodeBlock, CodeLang } from '../types/engine.js';
import { engines } from '../engines/index.js';
import { generateCode } from '../core/generator.js';
import { renderPreview } from '../core/previewRender.js';
import { ConfigPanel } from './ConfigPanel.js';

/** Comentario que encabeza cada bloque al copiar "todo junto". */
const CODE_COMMENTS: Record<CodeLang, string> = {
  html: '<!-- HTML -->',
  css: '/* CSS */',
  js: '// JavaScript',
};

const SHELL = `
  <div class="modal-overlay" id="modal-overlay" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal-head">
        <div class="modal-titles">
          <h3 id="modal-title"></h3>
          <p id="modal-desc"></p>
          <div class="modal-chips" id="modal-chips"></div>
        </div>
        <button class="icon-btn" id="modal-close" type="button" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="modal-body">
        <aside class="modal-config" aria-label="Configuración del componente">
          <div class="modal-config-head"><h4>Configuración</h4></div>
          <div id="modal-controls"></div>
        </aside>
        <section class="modal-result">
          <div class="modal-preview">
            <iframe id="modal-frame" sandbox="allow-scripts" title="Vista previa del componente"></iframe>
          </div>
          <div class="modal-code">
            <div class="modal-code-head">
              <div class="tabs" id="modal-tabs"></div>
              <div class="code-actions">
                <button class="btn-copy" id="modal-copy-all" type="button">Copiar todo</button>
                <button class="btn-copy" id="modal-copy" type="button">Copiar</button>
              </div>
            </div>
            <pre class="code-view"><code id="modal-code"></code></pre>
          </div>
        </section>
      </div>
    </div>
  </div>`;

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Falta el elemento #${id} en el modal.`);
  return element as T;
}

/** Copia al portapapeles con alternativa para contextos no seguros. */
async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', 'readonly');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

export interface ComponentModalHandlers {
  /** Notifica los valores actualizados para que App los recuerde. */
  onChange(values: ComponentValues): void;
}

export class ComponentModal {
  private readonly overlay: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly descEl: HTMLElement;
  private readonly chipsEl: HTMLElement;
  private readonly closeBtn: HTMLButtonElement;
  private readonly frame: HTMLIFrameElement;
  private readonly tabsEl: HTMLElement;
  private readonly codeEl: HTMLElement;
  private readonly config: ConfigPanel;

  private component: UIComponentItem | null = null;
  private values: ComponentValues = {};
  private blocks: CodeBlock[] = [];
  private activeTab = 0;
  private readonly categories: Record<CategoryId, CategoryMeta>;

  constructor(
    root: HTMLElement,
    categories: Record<CategoryId, CategoryMeta>,
    handlers: ComponentModalHandlers,
  ) {
    this.categories = categories;
    root.innerHTML = SHELL;

    this.overlay = requireElement('modal-overlay');
    this.titleEl = requireElement('modal-title');
    this.descEl = requireElement('modal-desc');
    this.chipsEl = requireElement('modal-chips');
    this.closeBtn = requireElement<HTMLButtonElement>('modal-close');
    this.frame = requireElement<HTMLIFrameElement>('modal-frame');
    this.tabsEl = requireElement('modal-tabs');
    this.codeEl = requireElement('modal-code');

    this.config = new ConfigPanel(requireElement('modal-controls'), (values) => {
      this.values = values;
      handlers.onChange(values);
      this.refresh();
    });

    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !this.overlay.hidden) this.close();
    });

    this.bindCopyButtons();
  }

  /** Abre el modal para un componente con sus valores actuales. */
  open(component: UIComponentItem, values: ComponentValues): void {
    this.component = component;
    this.values = { ...values };
    this.activeTab = 0;

    this.titleEl.textContent = component.name;
    this.descEl.textContent = component.description;
    this.renderChips(component);

    this.config.show(component, this.values);
    this.overlay.hidden = false;
    document.body.classList.add('modal-open');
    this.closeBtn.focus();

    this.refresh();
  }

  close(): void {
    this.overlay.hidden = true;
    document.body.classList.remove('modal-open');

    // Liberación de recursos: descarga el documento del iframe y detiene
    // cualquier rAF/listener/canvas que el componente hubiera arrancado.
    this.frame.srcdoc = '';
  }

  private renderChips(component: UIComponentItem): void {
    this.chipsEl.innerHTML = '';
    const catMeta = this.categories[component.category];
    const labels = [
      catMeta ? catMeta.label : component.category,
      engines[component.engine].meta.short,
    ];
    for (const label of labels) {
      const chip = document.createElement('span');
      chip.className = 'chip chip-engine';
      chip.textContent = label;
      this.chipsEl.appendChild(chip);
    }
  }

  /** Regenera vista previa y código con los valores actuales. */
  private refresh(): void {
    const component = this.component;
    if (!component) return;

    this.blocks = generateCode(component, this.values);
    this.activeTab = Math.min(this.activeTab, Math.max(this.blocks.length - 1, 0));

    this.renderTabs();
    this.renderCode();
    renderPreview(this.frame, this.blocks);
  }

  private renderTabs(): void {
    this.tabsEl.innerHTML = '';
    this.blocks.forEach((block, index) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = index === this.activeTab ? 'tab is-active' : 'tab';
      tab.textContent = block.label;
      tab.addEventListener('click', () => {
        this.activeTab = index;
        this.renderTabs();
        this.renderCode();
      });
      this.tabsEl.appendChild(tab);
    });
  }

  private renderCode(): void {
    const block = this.blocks[this.activeTab];
    this.codeEl.textContent = block ? block.code : '';
  }

  private buildAllCode(): string {
    return this.blocks
      .map((block) => `${CODE_COMMENTS[block.lang]}\n${block.code}`)
      .join('\n\n');
  }

  private bindCopyButtons(): void {
    const copyTab = requireElement<HTMLButtonElement>('modal-copy');
    const copyAll = requireElement<HTMLButtonElement>('modal-copy-all');

    copyTab.addEventListener('click', () => {
      const block = this.blocks[this.activeTab];
      if (!block) return;
      void copyText(block.code).then(() => this.flashCopied(copyTab, 'Copiar'));
    });

    copyAll.addEventListener('click', () => {
      if (this.blocks.length === 0) return;
      void copyText(this.buildAllCode()).then(() => this.flashCopied(copyAll, 'Copiar todo'));
    });
  }

  private flashCopied(button: HTMLButtonElement, original: string): void {
    button.textContent = '¡Copiado!';
    button.classList.add('is-ok');
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove('is-ok');
    }, 1300);
  }
}