/**
 * Punto de entrada de la aplicación.
 * index.html carga este archivo como módulo ES:
 *   <script type="module" src="./dist/main.js"></script>
 */
import { App } from './ui/App.js';

const mount = document.getElementById('app');
if (!mount) {
  throw new Error('No se encontró el contenedor #app en index.html.');
}

new App(mount);
