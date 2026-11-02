import { UIComponentItem } from '../../types/component.js';
import { RenderingEngine } from '../../types/engine.js';

export const btnMultifuncionDom: UIComponentItem = {
  id: 'btn-multifuncion-dom-XyZ',
  title: 'Botón Multifuncional Animado',
  category: 'botones',
  engine: 'dom',
  tags: ['boton', 'dom', 'interactivo', 'iconos', 'animacion', 'espanol'],
  
  controls: [
    { id: 'texto', label: 'Texto', type: 'text', defaultValue: 'DOWNLOAD' },
    { id: 'mainColor', label: 'Color Principal', type: 'color', defaultValue: '#8cc63f' },
    { id: 'textColor', label: 'Color de Texto', type: 'color', defaultValue: '#ffffff' },
    { id: 'iconColor', label: 'Color del Icono', type: 'color', defaultValue: '#8cc63f' }, // <--- NUEVO CONTROL
    { 
      id: 'icono', 
      label: 'Icono', 
      type: 'select', 
      defaultValue: 'download',
      options: [
        { label: 'Descargar', value: 'download' },
        { label: 'Subir', value: 'upload' },
        { label: 'Email', value: 'envelope' },
        { label: 'Teléfono', value: 'phone' },
        { label: 'Soporte', value: 'headset' },
        { label: 'Buscar', value: 'magnifying-glass' }, // Corregido para FA6
        { label: 'Web', value: 'globe' },
        { label: 'Inicio', value: 'house' }, // Corregido para FA6
        { label: 'Nube', value: 'cloud' },
        { label: 'Ajustes', value: 'gear' },
        { label: 'Info', value: 'info' }, // Corregido para FA6
        { label: 'Cancelar', value: 'xmark' },
        { label: 'Aprobar', value: 'check' },
        { label: 'Eliminar', value: 'trash' },
        { label: 'Perfil', value: 'user' },
        { label: 'Discusión', value: 'comments' }
      ]
    },
    { 
      id: 'animacion', 
      label: 'Animación al Clic', 
      type: 'select', 
      defaultValue: 'scale-down',
      options: [
        { label: 'Reducir Escala', value: 'scale-down' },
        { label: 'Aumentar Escala', value: 'scale-up' },
        { label: 'Rotar Ligero', value: 'rotate' },
        { label: 'Rebote', value: 'bounce' },
        { label: 'Agitar', value: 'shake' },
        { label: 'Giro Y', value: 'flip-y' },
        { label: 'Zoom In', value: 'zoom-in' }
      ]
    }
  ],

  htmlCode: '', cssCode: '', jsCode: '', tsCode: '',

  generateCode: (values: Record<string, any>, targetEngine?: RenderingEngine) => {
    return {
      html: `
<!-- HTML Nativo para DOM con FontAwesome 6 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<button id="btn-animated-dom" class="btn-container">
  <div class="btn-icon-wrapper">
    <i class="fa-solid fa-${values.icono}"></i>
  </div>
  <span class="btn-text">${values.texto}</span>
</button>
`,
      css: `
/* CSS puro */
.btn-container {
  background-color: ${values.mainColor};
  color: ${values.textColor};
  border: none;
  padding: 4px 24px 4px 4px; 
  font-size: 14px;
  font-weight: 700;
  font-family: 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 220px;
}

.btn-icon-wrapper {
  background-color: #ffffff;
  color: ${values.iconColor}; /* <--- Usa el color seleccionado para el icono */
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  font-size: 18px;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.btn-text {
  flex-grow: 1;
  text-align: center;
}

.btn-container:hover {
  filter: brightness(1.05);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

/* Clases de Animación al Clic */
.btn-container.animate { animation-duration: 0.3s; animation-fill-mode: both; }
.btn-container.scale-down.animate { animation-name: click-scale-down; }
.btn-container.scale-up.animate { animation-name: click-scale-up; }
.btn-container.rotate.animate { animation-name: click-rotate; }
.btn-container.bounce.animate { animation-name: click-bounce; }
.btn-container.shake.animate { animation-name: click-shake; }
.btn-container.flip-y.animate { animation-name: click-flip-y; }
.btn-container.zoom-in.animate { animation-name: click-zoom-in; }

/* Keyframes */
@keyframes click-scale-down { 0% { transform: scale(1); } 50% { transform: scale(0.92); } 100% { transform: scale(1); } }
@keyframes click-scale-up { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
@keyframes click-rotate { 0% { transform: rotate(0); } 50% { transform: rotate(4deg); } 100% { transform: rotate(0); } }
@keyframes click-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes click-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
@keyframes click-flip-y { 0% { transform: perspective(400px) rotateY(0); } 100% { transform: perspective(400px) rotateY(180deg); } }
@keyframes click-zoom-in { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
`,
      js: `
const btnDom = document.getElementById('btn-animated-dom');
if (btnDom) {
  const selectedAnim = "${values.animacion}";
  btnDom.className = 'btn-container ' + selectedAnim; 
  btnDom.addEventListener('click', () => {
    btnDom.classList.remove('animate');
    void btnDom.offsetWidth; 
    btnDom.classList.add('animate');
  });
}
`,
      ts: `
const btnDomTs = document.getElementById('btn-animated-dom') as HTMLButtonElement;
if (btnDomTs) {
  const selectedAnimTs = "${values.animacion}";
  btnDomTs.className = 'btn-container ' + selectedAnimTs;
  btnDomTs.addEventListener('click', () => {
    btnDomTs.classList.remove('animate');
    void btnDomTs.offsetWidth;
    btnDomTs.classList.add('animate');
  });
}
`
    };
  },

  renderPreview: (values: Record<string, any>, targetEngine?: RenderingEngine) => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    container.appendChild(faLink);

    const style = document.createElement('style');
    style.textContent = `
      .btn-container-XyZ {
        background-color: ${values.mainColor};
        color: ${values.textColor};
        border: none;
        padding: 4px 24px 4px 4px;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Segoe UI', Arial, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 50px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        min-width: 220px;
      }
      .btn-icon-wrapper-XyZ {
        background-color: #ffffff;
        color: ${values.iconColor}; /* <--- Color dinámico del icono en la preview */
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 16px;
        font-size: 18px;
        box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
      }
      .btn-text-XyZ { flex-grow: 1; text-align: center; }
      .btn-container-XyZ:hover { filter: brightness(1.05); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }

      .btn-container-XyZ.animate { animation-duration: 0.3s; animation-fill-mode: both; }
      .btn-container-XyZ.scale-down.animate { animation-name: click-scale-down; }
      .btn-container-XyZ.scale-up.animate { animation-name: click-scale-up; }
      .btn-container-XyZ.rotate.animate { animation-name: click-rotate; }
      .btn-container-XyZ.bounce.animate { animation-name: click-bounce; }
      .btn-container-XyZ.shake.animate { animation-name: click-shake; }
      .btn-container-XyZ.flip-y.animate { animation-name: click-flip-y; }
      .btn-container-XyZ.zoom-in.animate { animation-name: click-zoom-in; }

      @keyframes click-scale-down { 0% { transform: scale(1); } 50% { transform: scale(0.92); } 100% { transform: scale(1); } }
      @keyframes click-scale-up { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
      @keyframes click-rotate { 0% { transform: rotate(0); } 50% { transform: rotate(4deg); } 100% { transform: rotate(0); } }
      @keyframes click-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      @keyframes click-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
      @keyframes click-flip-y { 0% { transform: perspective(400px) rotateY(0); } 100% { transform: perspective(400px) rotateY(180deg); } }
      @keyframes click-zoom-in { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
    `;

    const btn = document.createElement('button');
    btn.className = 'btn-container-XyZ ' + values.animacion;
    
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'btn-icon-wrapper-XyZ';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-' + values.icono; 
    iconWrapper.appendChild(icon);

    const textSpan = document.createElement('span');
    textSpan.className = 'btn-text-XyZ';
    textSpan.textContent = values.texto;

    btn.appendChild(iconWrapper);
    btn.appendChild(textSpan);
    
    btn.addEventListener('click', () => {
      btn.classList.remove('animate');
      void btn.offsetWidth; 
      btn.classList.add('animate');
    });

    container.appendChild(style);
    container.appendChild(btn);

    return container;
  }
};