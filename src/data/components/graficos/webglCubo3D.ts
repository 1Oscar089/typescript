/**
 * Componente WebGL: cubo 3D interactivo con WebGL puro (sin librerías).
 * Motor: 'webgl'. Categoría: graficos.
 *
 * Demuestra el motor 3D activo con shaders GLSL, buffers de geometría,
 * matrices de proyección/rotación escritas a mano, sombreado por luz
 * direccional, DPR + ResizeObserver, pausa al hover, acciones al clic
 * (invertir giro, ciclar color, pulso de escala) y recuperación ante
 * pérdida de contexto (webglcontextlost/restored).
 *
 * El código generado es autónomo: copia HTML+CSS+JS a cualquier proyecto y
 * funciona sin dependencias ni paso de compilación.
 */
import type { ComponentValues, UIComponentItem } from '../../../types/component.js';

/** Convierte '#rrggbb' en [r, g, b] normalizado (0..1) para los uniformes. */
function hexARgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Matiz (0..360) de un color rgb normalizado; solo se usa al ciclar color. */
function matizDe(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return ((h * 60) + 360) % 360;
}

export const webglCubo3D: UIComponentItem = {
  id: 'webgl-cubo-3d',
  name: 'Cubo 3D (WebGL)',
  description:
    'Cubo 3D renderizado con WebGL puro (shaders GLSL, sin librerías): velocidad de giro, cámara con FOV, sombreado por luz, estilos sólido/aristas/puntos y respuestas al clic. Requiere aceleración gráfica activa.',
  tags: ['webgl', '3d', 'cubo', 'gpu', 'shaders', 'glsl', 'rotación', 'interactivo'],
  category: 'graficos',
  engine: 'webgl',

  controls: [
    { key: 'velocidad', label: 'Velocidad de giro (rad/s)', type: 'range', defaultValue: 1, min: 0, max: 3, step: 0.1 },
    { key: 'fov', label: 'Ángulo de cámara (°)', type: 'range', defaultValue: 45, min: 30, max: 90, step: 1 },
    { key: 'colorCubo', label: 'Color del cubo', type: 'color', defaultValue: '#7aa2ff' },
    { key: 'colorFondo', label: 'Color de fondo', type: 'color', defaultValue: '#0d1017' },
    {
      key: 'estilo',
      label: 'Estilo de dibujo',
      type: 'radio',
      defaultValue: 'solido',
      options: [
        { value: 'solido', label: 'Sólido' },
        { value: 'aristas', label: 'Aristas' },
        { value: 'puntos', label: 'Puntos' },
      ],
    },
    { key: 'brillo', label: 'Luz ambiente', type: 'range', defaultValue: 0.55, min: 0.15, max: 1, step: 0.05, hint: 'Solo afecta al modo sólido; aristas y puntos se dibujan planos.' },
    { key: 'pausaHover', label: 'Pausar giro al pasar el ratón', type: 'checkbox', defaultValue: true },
    {
      key: 'clickAccion',
      label: 'Al hacer clic',
      type: 'select',
      defaultValue: 'pulso',
      options: [
        { value: 'nada', label: 'Sin respuesta' },
        { value: 'invertir', label: 'Invertir giro' },
        { value: 'color', label: 'Cambiar de color' },
        { value: 'pulso', label: 'Pulso de escala' },
      ],
    },
  ],

  template: {
    html: (): string =>
      `<div class="cubo3d-escena">
  <canvas class="cubo3d-canvas"></canvas>
  <span class="cubo3d-aviso" hidden>Este navegador no pudo crear el contexto WebGL (revisa la aceleración gráfica).</span>
</div>`,

    css: (values: ComponentValues): string => {
      const clickable = String(values.clickAccion) !== 'nada';
      return `.cubo3d-escena {
  position: relative;
  width: min(100%, 560px);
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  background: ${values.colorFondo};
  box-shadow: inset 0 0 0 1px ${values.colorCubo}2e;
}

.cubo3d-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: manipulation;
  cursor: ${clickable ? 'pointer' : 'default'};
}

.cubo3d-aviso {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  color: #9aa7c7;
  font: 13px/1.6 system-ui, sans-serif;
}

/* El atributo hidden debe ganar siempre al display: grid de arriba. */
.cubo3d-aviso[hidden] { display: none; }`;
    },

    js: (values: ComponentValues): string => {
      const velocidad = Number(values.velocidad);
      const fov = Number(values.fov);
      const brillo = Number(values.brillo);
      const estilo = String(values.estilo);
      const pausaHover = values.pausaHover === true;
      const accion = String(values.clickAccion);

      const rgbCubo = hexARgb(String(values.colorCubo));
      const rgbFondo = hexARgb(String(values.colorFondo));
      const usaColor = accion === 'color';

      // --- Configuración horneada desde el panel ---
      const config = `const LIENZO = document.querySelector('.cubo3d-canvas');
const AVISO = document.querySelector('.cubo3d-aviso');

// ---- Configuración (horneada desde el panel del generador) ----
const VELOCIDAD = ${velocidad};          // rad/s
const FOV_GRADOS = ${fov};
const AMBIENTE = ${brillo};
const ESTILO = '${estilo}';              // solido | aristas | puntos
const PAUSA_HOVER = ${pausaHover};
const ACCION_CLICK = '${accion}';        // nada | invertir | color | pulso
const COLOR_FONDO = [${rgbFondo.join(', ')}];`;

      // --- Utilidades de color ---
      const utilidadesColor = `function hexARgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
let COLOR = hexARgb('${String(values.colorCubo)}');`;

      // Solo si la acción al clic es "cambiar de color" se emiten los helpers HSL
      // (el matiz inicial se hornea ya calculado desde TypeScript).
      const utilidadesHsl = usaColor
        ? `function hslARgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

let tono = ${matizDe(rgbCubo).toFixed(2)}; // matiz inicial de ${String(values.colorCubo)}`
        : '';

      // --- Geometría del cubo (24 vértices con normales por cara) ---
      const geometria = `// Caras del cubo: 4 vértices por cara con su normal (24 en total).
const CARAS = [
  -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1,   // frente
  -1,-1,-1, -1, 1,-1,  1, 1,-1,  1,-1,-1,   // atrás
  -1, 1,-1, -1, 1, 1,  1, 1, 1,  1, 1,-1,   // arriba
  -1,-1,-1,  1,-1,-1,  1,-1, 1, -1,-1, 1,   // abajo
   1,-1,-1,  1, 1,-1,  1, 1, 1,  1,-1, 1,   // derecha
  -1,-1,-1, -1,-1, 1, -1, 1, 1, -1, 1,-1,   // izquierda
];

const NORMALES = [
  0,0,1, 0,0,1, 0,0,1, 0,0,1,
  0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
  0,1,0, 0,1,0, 0,1,0, 0,1,0,
  0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
  1,0,0, 1,0,0, 1,0,0, 1,0,0,
  -1,0,0, -1,0,0, -1,0,0, -1,0,0,
];

const INDICES_TRIANGULOS = [
  0,1,2, 0,2,3,   4,5,6, 4,6,7,   8,9,10, 8,10,11,
  12,13,14, 12,14,15,   16,17,18, 16,18,19,   20,21,22, 20,22,23,
];

// Esquinas (para aristas y puntos) y centros de cara (para puntos).
const ESQUINAS = [
  -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1,
  -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1,
];

const ESQUINAS_Y_CENTROS = [
  -1,-1, 1,  1,-1, 1,  1, 1, 1, -1, 1, 1,
  -1,-1,-1,  1,-1,-1,  1, 1,-1, -1, 1,-1,
   0,0,1,  0,0,-1,  0,1,0,  0,-1,0,  1,0,0,  -1,0,0,
];

const INDICES_ARISTAS = [
  0,1, 1,2, 2,3, 3,0,   4,5, 5,6, 6,7, 7,4,
  0,4, 1,5, 2,6, 3,7,
];`;

      // --- Shaders GLSL ---
      const shaders = `const VERTICE = \`
attribute vec3 aPosicion;
attribute vec3 aNormal;
uniform mat4 uProyeccion;
uniform mat4 uVista;
uniform mat4 uModelo;
uniform float uPunto;
varying float vLuz;
void main() {
  gl_Position = uProyeccion * uVista * uModelo * vec4(aPosicion, 1.0);
  vec3 normal = normalize(vec3(uModelo * vec4(aNormal, 0.0)));
  vLuz = max(dot(normal, normalize(vec3(0.45, 0.75, 0.6))), 0.0);
  gl_PointSize = uPunto;
}\`;

const FRAGMENTO = \`
precision mediump float;
uniform vec3 uColor;
uniform float uAmbiente;
varying float vLuz;
void main() {
  float luz = uAmbiente + (1.0 - uAmbiente) * vLuz;
  gl_FragColor = vec4(uColor * luz, 1.0);
}\`;`;

      // --- Matrices 4x4 en column-major ---
      const matrices = `function multiplicar(a, b) {
  const r = new Float32Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let f = 0; f < 4; f += 1) {
      r[c * 4 + f] = a[f] * b[c * 4] + a[4 + f] * b[c * 4 + 1] + a[8 + f] * b[c * 4 + 2] + a[12 + f] * b[c * 4 + 3];
    }
  }
  return r;
}

function perspectiva(fov, aspecto, cerca, lejos) {
  const f = 1 / Math.tan(fov / 2);
  const rango = 1 / (cerca - lejos);
  const m = new Float32Array(16);
  m[0] = f / aspecto;
  m[5] = f;
  m[10] = (lejos + cerca) * rango;
  m[11] = -1;
  m[14] = 2 * lejos * cerca * rango;
  return m;
}

function rotX(angulo) {
  const c = Math.cos(angulo);
  const s = Math.sin(angulo);
  return new Float32Array([1, 0, 0, 0,  0, c, s, 0,  0, -s, c, 0,  0, 0, 0, 1]);
}

function rotY(angulo) {
  const c = Math.cos(angulo);
  const s = Math.sin(angulo);
  return new Float32Array([c, 0, -s, 0,  0, 1, 0, 0,  s, 0, c, 0,  0, 0, 0, 1]);
}

function escalaM(s) {
  const m = new Float32Array(16);
  m[0] = s; m[5] = s; m[10] = s; m[15] = 1;
  return m;
}

function traslacion(x, y, z) {
  const m = new Float32Array(16);
  m[0] = 1; m[5] = 1; m[10] = 1; m[15] = 1;
  m[12] = x; m[13] = y; m[14] = z;
  return m;
}`;

      // --- Ajuste de tamaño con DPR ---
      const ajuste = `function ajustar() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ancho = Math.max(1, Math.round(LIENZO.clientWidth * dpr));
  const alto = Math.max(1, Math.round(LIENZO.clientHeight * dpr));
  if (LIENZO.width !== ancho || LIENZO.height !== alto) {
    LIENZO.width = ancho;
    LIENZO.height = alto;
  }
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}`;

      // --- Arranque y bucle ---
      const arranque = `let gl = null;
let idAnim = 0;
let direccion = 1;
let pausado = false;
let pulso = 0;

main();

function main() {
  gl = LIENZO.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' })
    || LIENZO.getContext('experimental-webgl');
  if (!gl) {
    AVISO.hidden = false;
    return;
  }
  iniciar();

  // Recuperación ante pérdida de contexto (cambio de GPU, pestaña saturada...).
  LIENZO.addEventListener('webglcontextlost', (evento) => {
    evento.preventDefault();
    cancelAnimationFrame(idAnim);
  });
  LIENZO.addEventListener('webglcontextrestored', iniciar);

  ${pausaHover
    ? `LIENZO.addEventListener('mouseenter', () => { pausado = true; });
  LIENZO.addEventListener('mouseleave', () => { pausado = false; });`
    : ''}
  ${accion !== 'nada' ? "LIENZO.addEventListener('click', alHacerClic);" : ''}

  new ResizeObserver(() => ajustar()).observe(LIENZO);
}

${accion !== 'nada' ? `function alHacerClic() {
  ${accion === 'invertir'
    ? "direccion *= -1;"
    : accion === 'pulso'
      ? 'pulso = 1;'
      : `tono = (tono + 45) % 360;
  COLOR = hslARgb(tono, 0.72, 0.72);`}
}` : ''}

function iniciar() {
  function compilar(tipo, codigo) {
    const shader = gl.createShader(tipo);
    gl.shaderSource(shader, codigo);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[cubo3d]', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  const programa = gl.createProgram();
  gl.attachShader(programa, compilar(gl.VERTEX_SHADER, VERTICE));
  gl.attachShader(programa, compilar(gl.FRAGMENT_SHADER, FRAGMENTO));
  gl.linkProgram(programa);
  gl.useProgram(programa);

  const A_POS = gl.getAttribLocation(programa, 'aPosicion');
  const A_NOR = gl.getAttribLocation(programa, 'aNormal');
  const U = {
    proyeccion: gl.getUniformLocation(programa, 'uProyeccion'),
    vista: gl.getUniformLocation(programa, 'uVista'),
    modelo: gl.getUniformLocation(programa, 'uModelo'),
    color: gl.getUniformLocation(programa, 'uColor'),
    ambiente: gl.getUniformLocation(programa, 'uAmbiente'),
    punto: gl.getUniformLocation(programa, 'uPunto'),
  };

  function cargar(datos, tamano, loc) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, datos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, tamano, gl.FLOAT, false, 0, 0);
  }

  if (ESTILO === 'solido') {
    cargar(new Float32Array(CARAS), 3, A_POS);
    cargar(new Float32Array(NORMALES), 3, A_NOR);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(INDICES_TRIANGULOS), gl.STATIC_DRAW);
  } else {
    // Aristas y puntos no usan normales: se fija un valor plano.
    const puntos = ESTILO === 'puntos' ? ESQUINAS_Y_CENTROS : ESQUINAS;
    cargar(new Float32Array(puntos), 3, A_POS);
    gl.disableVertexAttribArray(A_NOR);
    gl.vertexAttrib3f(A_NOR, 0, 0, 0);
    if (ESTILO === 'aristas') {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(INDICES_ARISTAS), gl.STATIC_DRAW);
    }
  }

  ajustar();

  let anterior = 0;
  let anguloX = 0.5;
  let anguloY = 0.7;

  function cuadro(t) {
    const dt = anterior ? Math.min((t - anterior) / 1000, 0.05) : 0;
    anterior = t;
    if (!pausado) {
      anguloY += VELOCIDAD * direccion * dt;
      anguloX += VELOCIDAD * 0.32 * dt;
    }
    if (pulso > 0) pulso = Math.max(0, pulso - dt / 0.45);

    ajustar();
    gl.clearColor(COLOR_FONDO[0], COLOR_FONDO[1], COLOR_FONDO[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const modelo = multiplicar(
      escalaM(1 + 0.22 * Math.sin(pulso * Math.PI)),
      multiplicar(rotY(anguloY), rotX(anguloX)),
    );
    const aspecto = Math.max(LIENZO.width, 1) / Math.max(LIENZO.height, 1);

    gl.uniformMatrix4fv(U.proyeccion, false, perspectiva((FOV_GRADOS * Math.PI) / 180, aspecto, 0.1, 100));
    gl.uniformMatrix4fv(U.vista, false, traslacion(0, 0, -4.8));
    gl.uniformMatrix4fv(U.modelo, false, modelo);
    gl.uniform3f(U.color, COLOR[0], COLOR[1], COLOR[2]);
    gl.uniform1f(U.ambiente, ESTILO === 'solido' ? AMBIENTE : 1);
    gl.uniform1f(U.punto, ESTILO === 'puntos' ? Math.max(6, Math.round(LIENZO.clientWidth / 28)) : 2);

    if (ESTILO === 'solido') {
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    } else if (ESTILO === 'aristas') {
      gl.drawElements(gl.LINES, INDICES_ARISTAS.length, gl.UNSIGNED_SHORT, 0);
      gl.drawArrays(gl.POINTS, 0, 8); // vértices brillando en las esquinas
    } else {
      gl.drawArrays(gl.POINTS, 0, 14);
    }

    idAnim = requestAnimationFrame(cuadro);
  }

  idAnim = requestAnimationFrame(cuadro);
}`;

      return [
        config,
        utilidadesColor,
        utilidadesHsl,
        geometria,
        shaders,
        matrices,
        ajuste,
        arranque,
      ].filter((parte) => parte).join('\n\n');
    },
  },
};