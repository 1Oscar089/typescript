/**
 * Orquestador central (core): une el componente seleccionado del registro,
 * los valores del panel de configuración y el motor de renderizado que le
 * corresponde. Es el único punto donde la UI habla con los motores.
 */
import type { ComponentValues, UIComponentItem } from '../types/component.js';
import type { CodeBlock } from '../types/engine.js';
import { engines } from '../engines/index.js';

/**
 * Genera los bloques de código del componente delegando en su motor
 * (patrón Strategy). Lanza un error descriptivo si el motor no está
 * registrado en src/engines/index.ts.
 */
export function generateCode(component: UIComponentItem, values: ComponentValues): CodeBlock[] {
  const engine = engines[component.engine];

  if (!engine) {
    throw new Error(`Motor no registrado: "${component.engine}" (componente "${component.id}")`);
  }

  return engine.render({ component, values });
}

/** Construye el objeto de valores a partir de los valores por defecto declarados. */
export function defaultValues(component: UIComponentItem): ComponentValues {
  const values: ComponentValues = {};
  for (const control of component.controls) {
    values[control.key] = control.defaultValue;
  }
  return values;
}
