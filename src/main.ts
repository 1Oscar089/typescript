import { createButton } from './components/Button.js';

document.addEventListener('DOMContentLoaded', () => {
  const headerRegion = document.getElementById('header-region');
  const sidebarRegion = document.getElementById('sidebar-region');
  const contentRegion = document.getElementById('content-region');

  // 1. Llenar el Header
  if (headerRegion) {
    const title = document.createElement('h2');
    title.textContent = 'Sistema de Gestión Escolar';
    title.style.fontSize = '1.25rem';
    headerRegion.appendChild(title);
  }

  // 2. Llenar el Sidebar
  if (sidebarRegion) {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
        <li><a href="#alumnos" style="color: inherit; text-decoration: none;">📚 Alumnos</a></li>
        <li><a href="#profesores" style="color: inherit; text-decoration: none;">👨‍🏫 Profesores</a></li>
        <li><a href="#reportes" style="color: inherit; text-decoration: none;">📊 Reportes</a></li>
      </ul>
    `;
    sidebarRegion.appendChild(nav);
  }

  // 3. Llenar el Contenido Principal
  if (contentRegion) {
    const heading = document.createElement('h1');
    heading.textContent = 'Panel de Control';
    heading.style.marginBottom = '16px';
    contentRegion.appendChild(heading);

    // Botón normal dentro del contenido
    const btnGuardar = createButton({
      text: 'Guardar Cambios',
      onClick: () => alert('Cambios guardados')
    });
    contentRegion.appendChild(btnGuardar);

    // Botón flotante opcional (esquina inferior derecha)
    const btnFlotante = createButton({
      text: '+ Nuevo Alumno',
      onClick: () => alert('Abrir formulario')
    });
    btnFlotante.classList.add('btn-flotante-inferior');
    contentRegion.appendChild(btnFlotante);
  }
});