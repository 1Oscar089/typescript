import { componentsRegistry } from './data/componentsData.js';
import { webEngines } from './data/engines.js';
import { UIComponentItem, ComponentControl } from './types/component.js';
// Forzar la carga de FontAwesome en el <head> de la página
if (!document.getElementById('font-awesome-cdn')) {
  const faLink = document.createElement('link');
  faLink.id = 'font-awesome-cdn';
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(faLink);
}
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container');
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const engineFilterWrapper = document.getElementById('engine-filter-wrapper'); // <--- Nuevo contenedor principal
  
  const modalContainer = document.getElementById('modal-container');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const previewBox = document.getElementById('preview-box');
  const codeDisplay = document.getElementById('code-display');
  const btnCopy = document.getElementById('btn-copy');

  const controlsSection = document.getElementById('modal-controls-section');
  const controlsGrid = document.getElementById('controls-grid');
  const btnResetControls = document.getElementById('btn-reset-controls');

  const categoryItems = document.querySelectorAll('#category-list li');

  let activeCategory = 'todos';
  let activeEngineId = 'todos'; // 'todos' muestra todos los motores de la categoría
  let searchQuery = '';
  let activeComponent: UIComponentItem | null = null;
  let activeTab: 'html' | 'css' | 'js' | 'ts' = 'html';
  let currentControlValues: Record<string, any> = {};

  // --- REFERENCIAS DEL DOM (TEMA Y SIDEBAR) ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const sidebar = document.getElementById('app-sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  // --- LÓGICA DEL TEMA CLARO/OSCURO ---
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  function setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  }

  // --- LÓGICA DEL MENÚ LATERAL (MÓVILES) ---
  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('active');
  });

  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('active');
  }

  menuClose?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);
  // --- RENDERIZAR FILTRO DE MOTORES ---
  function renderEngineFilter() {
    if (!engineFilterWrapper) return;
    engineFilterWrapper.innerHTML = '';

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.textContent = 'Todos los Motores';

    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-dropdown';

    const optsList = document.createElement('ul');
    optsList.className = 'custom-select-options';

    // Opción para ver todos
    const allOpt = document.createElement('li');
    allOpt.className = `custom-select-option ${activeEngineId === 'todos' ? 'selected' : ''}`;
    allOpt.innerHTML = `<strong>Todos los Motores</strong>`;
    allOpt.addEventListener('click', (e) => selectEngineFilter(e, 'todos', 'Todos los Motores', trigger, dropdown));
    optsList.appendChild(allOpt);

    // Opciones de cada motor
    webEngines.forEach(eng => {
      const li = document.createElement('li');
      li.className = `custom-select-option ${eng.id === activeEngineId ? 'selected' : ''}`;
      li.innerHTML = `<strong>${eng.name}</strong><small>${eng.tools}</small>`;
      li.addEventListener('click', (e) => selectEngineFilter(e, eng.id, eng.name, trigger, dropdown));
      optsList.appendChild(li);
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    dropdown.appendChild(optsList);
    engineFilterWrapper.appendChild(trigger);
    engineFilterWrapper.appendChild(dropdown);
  }

  function selectEngineFilter(e: Event, engineId: string, engineName: string, trigger: HTMLElement, dropdown: HTMLElement) {
    e.stopPropagation();
    activeEngineId = engineId;
    trigger.textContent = engineName;
    dropdown.classList.remove('open');
    
    // Actualizar visualmente la selección
    dropdown.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
    (e.currentTarget as HTMLElement).classList.add('selected');
    
    filterAndRender(); // Filtrar inmediatamente
  }

  // --- FILTRADO PRINCIPAL ---
  function filterAndRender() {
    const filtered = componentsRegistry.filter(item => {
      const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
      const matchesEngine = activeEngineId === 'todos' || item.engine === activeEngineId;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesEngine && matchesSearch;
    });
    renderCards(filtered);
  }

  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase().trim();
    filterAndRender();
  });

  categoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      categoryItems.forEach(cat => cat.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      activeCategory = target.dataset.category || 'todos';
      filterAndRender();
    });
  });

  function renderCards(items: UIComponentItem[]) {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    if (items.length === 0) {
      gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--md-sys-color-on-surface-variant);">No hay componentes para este filtro.</div>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-item';
      
      const motorTag = webEngines.find(e => e.id === item.engine)?.name || item.engine;
      
      card.innerHTML = `
        <div>
          <h4 class="card-title">${item.title}</h4>
          <small style="color: var(--md-sys-color-primary); font-weight: bold;">${item.category.toUpperCase()} • ${motorTag.toUpperCase()}</small>
        </div>
        <div class="card-tags">${item.tags.map(tag => `<span class="tag-chip">#${tag}</span>`).join('')}</div>`;
      card.addEventListener('click', () => openModal(item));
      gridContainer.appendChild(card);
    });
  }

  // --- MODAL Y CONTROLES (Sin selector de motor) ---
  function openModal(item: UIComponentItem) {
    activeComponent = item;
    if (modalTitle) modalTitle.textContent = `${item.title} (${webEngines.find(e => e.id === item.engine)?.name || item.engine})`;

    currentControlValues = {};
    if (item.controls && item.controls.length > 0) {
      item.controls.forEach(ctrl => currentControlValues[ctrl.id] = ctrl.defaultValue);
      renderControlInputs(item.controls);
      if (controlsSection) controlsSection.style.display = 'flex';
    } else {
      if (controlsSection) controlsSection.style.display = 'none';
    }

    updateLivePreviewAndCode();
    modalContainer?.classList.remove('hidden');
  }

  function renderControlInputs(controls: ComponentControl[]) {
    if (!controlsGrid) return;
    controlsGrid.innerHTML = '';
    controls.forEach(ctrl => {
      const wrapper = document.createElement('div');
      wrapper.className = 'control-item';
      wrapper.innerHTML = `<label class="control-label"><span>${ctrl.label}</span><span class="control-val-badge" id="val-${ctrl.id}">${ctrl.defaultValue}${ctrl.unit || ''}</span></label>`;

      let inputEl: HTMLElement; // Variable genérica para guardar el select o el input

      // Si el tipo es 'select' y tiene opciones
      if (ctrl.type === 'select' && ctrl.options) {
        const select = document.createElement('select');
        // Estilos básicos para que combine con tu panel oscuro/claro
        select.style.width = '100%';
        select.style.padding = '8px';
        select.style.borderRadius = '4px';
        select.style.border = '1px solid var(--md-sys-color-outline)';
        select.style.backgroundColor = 'var(--md-sys-color-surface)';
        select.style.color = 'var(--md-sys-color-on-surface)';

        // Agregar cada opción al select
        ctrl.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = String(opt.value);
          option.textContent = opt.label;
          if (opt.value === ctrl.defaultValue) option.selected = true;
          select.appendChild(option);
        });

        // Evento 'change' (no 'input') para los selects
        select.addEventListener('change', (e) => {
          currentControlValues[ctrl.id] = (e.target as HTMLSelectElement).value;
          const b = document.getElementById(`val-${ctrl.id}`);
          if (b) b.textContent = String(currentControlValues[ctrl.id]);
          updateLivePreviewAndCode();
        });

        select.className = `control-input-select`;
        inputEl = select;

      } else {
        // Tu código original intacto para inputs (texto, rango, color)
        const input = document.createElement('input');
        input.type = ctrl.type === 'color' ? 'color' : ctrl.type === 'range' ? 'range' : 'text';
        input.value = String(ctrl.defaultValue);
        if (ctrl.type === 'range') { 
          input.min = String(ctrl.min ?? 0); 
          input.max = String(ctrl.max ?? 100); 
          input.step = String(ctrl.step ?? 1); 
        }

        input.addEventListener('input', (e) => {
          currentControlValues[ctrl.id] = (e.target as HTMLInputElement).value;
          const b = document.getElementById(`val-${ctrl.id}`);
          if (b) b.textContent = ctrl.type === 'range' ? `${currentControlValues[ctrl.id]}${ctrl.unit || ''}` : String(currentControlValues[ctrl.id]);
          updateLivePreviewAndCode();
        });

        input.className = `control-input-${ctrl.type}`;
        inputEl = input;
      }

      // Agregar al DOM el elemento que se haya creado
      wrapper.appendChild(inputEl);
      controlsGrid.appendChild(wrapper);
    });
  }

  btnResetControls?.addEventListener('click', () => {
    if (!activeComponent?.controls) return;
    activeComponent.controls.forEach(c => currentControlValues[c.id] = c.defaultValue);
    renderControlInputs(activeComponent.controls);
    updateLivePreviewAndCode();
  });

  function updateLivePreviewAndCode() {
    if (!activeComponent) return;
    
    if (previewBox) {
      previewBox.innerHTML = '';
      const shadowHost = document.createElement('div');
      shadowHost.style.cssText = 'width:100%; height:100%; display:flex; align-items:center; justify-content:center;';
      const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
      
      const previewElement = activeComponent.renderPreview(currentControlValues); // <--- Limpio
      shadowRoot.appendChild(previewElement);
      previewBox.appendChild(shadowHost);
    }
    
    updateCodeView();
  }

  function updateCodeView() {
    if (!activeComponent || !codeDisplay) return;
    let gen = { html: activeComponent.htmlCode, css: activeComponent.cssCode, js: activeComponent.jsCode || '', ts: activeComponent.tsCode || '' };

    if (activeComponent.generateCode) {
      gen = activeComponent.generateCode(currentControlValues); // <--- Limpio
    }

    if (activeTab === 'html') codeDisplay.textContent = gen.html;
    if (activeTab === 'css') codeDisplay.textContent = gen.css;
    if (activeTab === 'js') codeDisplay.textContent = gen.js;
    if (activeTab === 'ts') codeDisplay.textContent = gen.ts;
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      activeTab = target.dataset.tab as 'html' | 'css' | 'js' | 'ts';
      updateCodeView();
    });
  });

  btnCopy?.addEventListener('click', () => {
    if (!codeDisplay?.textContent) return;
    navigator.clipboard.writeText(codeDisplay.textContent);
    btnCopy.textContent = '✅ Copiado';
    setTimeout(() => { btnCopy.textContent = '📋 Copiar Código'; }, 2000);
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-dropdown.open').forEach(d => d.classList.remove('open'));
  });
  
  modalClose?.addEventListener('click', () => modalContainer?.classList.add('hidden'));
  modalContainer?.addEventListener('click', (e) => { if (e.target === modalContainer) modalContainer.classList.add('hidden'); });

  // INICIAR
  renderEngineFilter();
  filterAndRender();
});