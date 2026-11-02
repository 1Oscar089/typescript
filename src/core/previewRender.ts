/**
 * Entorno aislado de previsualización (solo MODAL).
 *
 * Ensambla un documento HTML completo con los bloques generados por el motor
 * y lo pinta dentro de un <iframe sandbox="allow-scripts">: el código del
 * componente corre aislado del propio generador, igual que correrá en un
 * proyecto externo cuando el usuario lo copie y pegue.
 *
 * El iframe del modal es el ÚNICO lugar donde el componente se ejecuta: las
 * tarjetas del grid son estáticas (título + descripción) para no gastar
 * recursos, y al cerrar el modal se descarga el srcdoc (ver ComponentModal).
 */
import type { CodeBlock } from '../types/engine.js';

/** CSS base del escenario del modal. */
const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  body {
    display: grid;
    place-items: center;
    padding: 24px;
    background: #0d1017;
    color: #e7ebf4;
    font-family: "Segoe UI", system-ui, sans-serif;
  }
  .gc-canvas-frame { border-radius: 12px; overflow: hidden; }
`;

/** Ensambla el documento HTML completo de la previsualización. */
export function buildPreviewDocument(blocks: CodeBlock[]): string {
  const html = blocks.filter((block) => block.lang === 'html').map((block) => block.code).join('\n');
  const css = blocks.filter((block) => block.lang === 'css').map((block) => block.code).join('\n\n');
  const js = blocks.filter((block) => block.lang === 'js').map((block) => block.code).join('\n\n');

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>${BASE_CSS}
${css}</style>
  </head>
  <body>
${html}
    <script>
      try {
${js}
      } catch (error) {
        console.error('[Vista previa]', error);
      }
    </script>
  </body>
</html>`;
}

/** Pinta los bloques generados dentro del iframe aislado (sandbox). */
export function renderPreview(frame: HTMLIFrameElement, blocks: CodeBlock[]): void {
  frame.srcdoc = buildPreviewDocument(blocks);
}