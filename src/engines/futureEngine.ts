/**
 * Fábrica de motores [FUTURO].
 *
 * Los motores aún sin integración (WebGL, WebXR, videojuegos, WebAssembly)
 * comparten este generador de aviso estilizado: mantienen su ficha visible en
 * el filtrador de motores y devuelven un bloque informativo hasta que se
 * implemente su renderizado real.
 */
import type { CodeBlock, EngineMeta, RenderingEngine } from '../types/engine.js';

const NOTICE_CSS = `.gc-notice {
  max-width: 440px;
  padding: 22px 24px;
  border: 1px dashed #33405c;
  border-radius: 12px;
  color: #9aa7c7;
  font: 14px/1.65 system-ui, sans-serif;
  text-align: center;
}
.gc-notice strong { color: #c9d4ee; font-size: 15px; display: block; margin-bottom: 6px; }`;

export function createFutureEngine(meta: EngineMeta): RenderingEngine {
  return {
    meta,

    render(): CodeBlock[] {
      return [
        {
          lang: 'html',
          label: 'HTML',
          code: [
            '<div class="gc-notice">',
            `  <strong>${meta.name}</strong>`,
            `  Motor en preparación. Herramientas previstas: ${meta.tools}.`,
            '</div>',
          ].join('\n'),
        },
        { lang: 'css', label: 'CSS', code: NOTICE_CSS },
      ];
    },
  };
}
