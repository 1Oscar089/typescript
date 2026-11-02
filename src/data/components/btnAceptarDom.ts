import { UIComponentItem } from '../../types/component.js';

export const btnAceptarDom: UIComponentItem = {
  id: 'btn-aceptar-dom-7a3b',
  title: 'Botón Aceptar Animado',
  category: 'botones',
  engine: 'dom', // <--- Asignamos el motor aquí
  tags: ['boton', 'dom', 'interactivo', 'aceptar', 'animacion'],
  
  controls: [
    { id: 'bgColor', label: 'Color de Fondo', type: 'color', defaultValue: '#4caf50' },
    { id: 'textColor', label: 'Color de Texto', type: 'color', defaultValue: '#ffffff' },
    { id: 'borderRadius', label: 'Borde Redondeado', type: 'range', defaultValue: 8, min: 0, max: 50, unit: 'px' },
    { id: 'scaleClick', label: 'Escala al Clic', type: 'range', defaultValue: 0.95, min: 0.8, max: 0.99, step: 0.01 }
  ],

  htmlCode: '', cssCode: '', jsCode: '', tsCode: '',

  // Ya no necesitamos targetEngine aquí
  generateCode: (values: Record<string, any>) => {
    return {
      html: `<!-- HTML Nativo para DOM -->\n<button id="mi-boton-aceptar">Aceptar</button>`,
      css: `/* CSS puro */
#mi-boton-aceptar {
  background-color: ${values.bgColor};
  color: ${values.textColor};
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: ${values.borderRadius}px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
#mi-boton-aceptar:hover { filter: brightness(1.1); box-shadow: 0 6px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
#mi-boton-aceptar:active { transform: scale(${values.scaleClick}) translateY(0); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }`,
      js: `document.getElementById('mi-boton-aceptar').addEventListener('click', () => { console.log('Clic'); });`,
      ts: `const btn = document.getElementById('mi-boton-aceptar') as HTMLButtonElement;\nbtn.addEventListener('click', () => { console.log('Clic'); });`
    };
  },

  renderPreview: (values: Record<string, any>) => {
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;';
    const style = document.createElement('style');
    style.textContent = `
      .btn-preview-7a3b { background-color: ${values.bgColor}; color: ${values.textColor}; border: none; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: ${values.borderRadius}px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .btn-preview-7a3b:hover { filter: brightness(1.1); box-shadow: 0 6px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
      .btn-preview-7a3b:active { transform: scale(${values.scaleClick}) translateY(0); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    `;
    const btn = document.createElement('button');
    btn.className = 'btn-preview-7a3b';
    btn.textContent = 'Aceptar';
    container.appendChild(style);
    container.appendChild(btn);
    return container;
  }
};