/**
 * Panel de configuración: construye dinámicamente los controles declarados
 * por el componente seleccionado (UIControl[]) y notifica cada cambio.
 *
 * Soporta: sliders (range), inputs de texto/numéricos, color, select,
 * grupos de radio (chips seleccionables) y switches (checkbox).
 * Se usa dentro del modal de personalización.
 */
import type { ComponentValues, UIComponentItem, UIControl } from '../types/component.js';
import { defaultValues } from '../core/generator.js';

export type ConfigChangeHandler = (values: ComponentValues) => void;

export class ConfigPanel {
  private readonly root: HTMLElement;
  private readonly onChange: ConfigChangeHandler;
  private component: UIComponentItem | null = null;
  private values: ComponentValues = {};

  constructor(root: HTMLElement, onChange: ConfigChangeHandler) {
    this.root = root;
    this.onChange = onChange;
  }

  /** Muestra el componente con sus valores actuales. */
  show(component: UIComponentItem, values: ComponentValues): void {
    this.component = component;
    this.values = { ...values };
    this.render();
  }

  private render(): void {
    const component = this.component;
    if (!component) return;

    this.root.innerHTML = '';

    const controls = document.createElement('div');
    controls.className = 'config-controls';
    for (const control of component.controls) {
      controls.appendChild(control.type === 'checkbox' ? this.buildSwitch(control) : this.buildField(control));
    }
    this.root.appendChild(controls);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'config-reset';
    reset.textContent = 'Restablecer valores';
    reset.addEventListener('click', () => {
      if (!this.component) return;
      this.values = defaultValues(this.component);
      this.render();
      this.emitChange();
    });
    this.root.appendChild(reset);
  }

  /** Construye un control de campo (range, number, text, color, radio o select). */
  private buildField(control: UIControl): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'control';

    const headRow = document.createElement('div');
    headRow.className = 'control-head';
    const label = document.createElement('label');
    label.textContent = control.label;
    label.setAttribute('for', `ctl-${control.key}`);
    const output = document.createElement('output');
    output.textContent = this.formatValue(control);
    headRow.append(label, output);
    wrap.appendChild(headRow);

    if (control.type === 'range' || control.type === 'number') {
      const input = document.createElement('input');
      input.type = control.type;
      input.id = `ctl-${control.key}`;
      if (control.min !== undefined) input.min = String(control.min);
      if (control.max !== undefined) input.max = String(control.max);
      if (control.step !== undefined) input.step = String(control.step);
      input.value = String(this.values[control.key] ?? control.defaultValue);
      input.addEventListener('input', () => {
        this.values[control.key] = Number(input.value);
        output.textContent = this.formatValue(control);
        this.emitChange();
      });
      wrap.appendChild(input);
    } else if (control.type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `ctl-${control.key}`;
      input.value = String(this.values[control.key] ?? '');
      if (control.placeholder) input.placeholder = control.placeholder;
      input.addEventListener('input', () => {
        this.values[control.key] = input.value;
        this.emitChange();
      });
      wrap.appendChild(input);
    } else if (control.type === 'color') {
      const input = document.createElement('input');
      input.type = 'color';
      input.id = `ctl-${control.key}`;
      input.value = String(this.values[control.key] ?? '#ffffff');
      input.addEventListener('input', () => {
        this.values[control.key] = input.value;
        output.textContent = input.value.toUpperCase();
        this.emitChange();
      });
      wrap.appendChild(input);
    } else if (control.type === 'radio') {
      wrap.appendChild(this.buildRadioGroup(control));
    } else {
      const select = document.createElement('select');
      select.id = `ctl-${control.key}`;
      for (const option of control.options ?? []) {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        if (String(this.values[control.key]) === option.value) opt.selected = true;
        select.appendChild(opt);
      }
      select.addEventListener('change', () => {
        this.values[control.key] = select.value;
        this.emitChange();
      });
      wrap.appendChild(select);
    }

    if (control.hint) {
      const hint = document.createElement('p');
      hint.className = 'control-hint';
      hint.textContent = control.hint;
      wrap.appendChild(hint);
    }

    return wrap;
  }

  /** Grupo de opciones excluyentes renderizado como chips seleccionables. */
  private buildRadioGroup(control: UIControl): HTMLElement {
    const group = document.createElement('div');
    group.className = 'radio-group';
    group.id = `ctl-${control.key}`;
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', control.label);

    for (const option of control.options ?? []) {
      const chip = document.createElement('label');
      chip.className = 'radio-chip';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `radio-${control.key}`;
      input.value = option.value;
      input.checked = String(this.values[control.key]) === option.value;
      input.addEventListener('change', () => {
        if (!input.checked) return;
        this.values[control.key] = input.value;
        this.emitChange();
      });

      const dot = document.createElement('span');
      dot.className = 'radio-dot';
      const text = document.createElement('span');
      text.textContent = option.label;

      chip.append(input, dot, text);
      group.appendChild(chip);
    }

    return group;
  }

  /** Construye un interruptor booleano (control tipo checkbox). */
  private buildSwitch(control: UIControl): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'control control--switch';

    const label = document.createElement('label');
    label.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `ctl-${control.key}`;
    input.checked = this.values[control.key] === true;
    input.addEventListener('change', () => {
      this.values[control.key] = input.checked;
      this.emitChange();
    });

    const text = document.createElement('span');
    text.textContent = control.label;

    label.append(input, text);
    wrap.appendChild(label);

    if (control.hint) {
      const hint = document.createElement('p');
      hint.className = 'control-hint';
      hint.textContent = control.hint;
      wrap.appendChild(hint);
    }

    return wrap;
  }

  private formatValue(control: UIControl): string {
    const value = this.values[control.key];
    if (control.type === 'color') return String(value).toUpperCase();
    if (control.type === 'range' || control.type === 'number') return String(value);
    return '';
  }

  private emitChange(): void {
    this.onChange({ ...this.values });
  }
}
