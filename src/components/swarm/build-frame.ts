import { smoothstep } from './math';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Vec {
  x: number;
  y: number;
}

/**
 * Punto del perímetro de un rectángulo, a `s` px de la esquina superior izquierda
 * en sentido horario. Da la vuelta, así las cabezas y sus seguidores pueden cruzar
 * la esquina inicial.
 */
export function perimeterPoint(r: Rect, s: number, out: Vec): Vec {
  const P = 2 * (r.width + r.height);
  if (!(P > 0) || !Number.isFinite(s)) {
    out.x = r.left;
    out.y = r.top;
    return out;
  }
  let d = ((s % P) + P) % P;
  if (d <= r.width) {
    out.x = r.left + d;
    out.y = r.top;
    return out;
  }
  d -= r.width;
  if (d <= r.height) {
    out.x = r.left + r.width;
    out.y = r.top + d;
    return out;
  }
  d -= r.height;
  if (d <= r.width) {
    out.x = r.left + r.width - d;
    out.y = r.top + r.height;
    return out;
  }
  d -= r.width;
  out.x = r.left;
  out.y = r.top + r.height - d;
  return out;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Marco de construcción: vive en el DOM, no en el canvas
 *
 * El scroll táctil lo conduce el compositor del navegador, un frame o más por
 * delante de JavaScript. Un marco pintado en un canvas fijo a partir de
 * `getBoundingClientRect` queda por detrás del componente que enmarca y vibra
 * visiblemente al deslizar. Un marco que es un nodo del DOM dentro de la página
 * se desplaza *junto* con el contenido, así que se mantiene pegado a él por
 * rápido que mueva el dedo; el motor solo debe moverlo cuando el propio
 * componente cambia de tamaño o posición. Al ser DOM real, además, se ve nítido
 * con cualquier densidad de píxeles.
 * ──────────────────────────────────────────────────────────────────────── */

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_HEADS = 4;
const SCAN_BAND = 26;

export interface FrameState {
  label: string;
  /** Cuántas cabezas entintan el borde en paralelo (cada una cubre 1/heads de él). */
  heads: number;
  /** Progreso del entintado del borde, 0 → 1. */
  inked: number;
  /** Progreso del revelado para la línea de escaneo, o `null` si no hay. */
  scan: number | null;
  alpha: number;
}

export interface FrameView {
  update(rect: Rect, state: FrameState): void;
  remove(): void;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, parent?: HTMLElement) {
  const node = document.createElement(tag);
  node.className = className;
  parent?.appendChild(node);
  return node;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, className: string, parent: Element) {
  const node = document.createElementNS(SVG_NS, tag);
  node.setAttribute('class', className);
  parent.appendChild(node);
  return node;
}

export function createFrameView(layer: HTMLElement, line: boolean): FrameView {
  const root = el('div', line ? 'swarm-frame swarm-frame--line' : 'swarm-frame', layer);

  // Últimos valores escritos: se omiten escrituras de estilo (y trabajo de layout/pintado) si nada cambió.
  let lx = NaN;
  let ly = NaN;
  let lw = NaN;
  let lh = NaN;
  let lAlpha = NaN;
  let lHandle = NaN;
  let lText = '';
  let lScan = NaN;
  const lInk: string[] = [];

  /* ── divisor: una guía punteada con una línea sólida entintada encima ── */
  if (line) {
    el('div', 'swarm-frame__line-ghost', root);
    const ink = el('div', 'swarm-frame__line-ink', root);
    el('i', 'swarm-frame__tick swarm-frame__tick--l', root);
    el('i', 'swarm-frame__tick swarm-frame__tick--r', root);

    return {
      update(rect, s) {
        const x = Math.round(rect.left * 10) / 10;
        const y = Math.round(rect.top * 10) / 10;
        if (x !== lx || y !== ly) {
          root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          lx = x;
          ly = y;
        }
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w !== lw || h !== lh) {
          root.style.width = `${w}px`;
          root.style.height = `${h}px`;
          lw = w;
          lh = h;
        }
        const alpha = Math.round(s.alpha * 100) / 100;
        if (alpha !== lAlpha) {
          root.style.opacity = String(alpha);
          lAlpha = alpha;
        }
        const scale = `scaleX(${s.inked.toFixed(3)})`;
        if (scale !== lText) {
          ink.style.transform = scale;
          lText = scale;
        }
      },
      remove() {
        root.remove();
      },
    };
  }

  /* ── caja ── */
  const svg = svgEl('svg', 'swarm-frame__svg', root);
  const ghost = svgEl('rect', 'swarm-frame__ghost', svg);
  const inks: SVGRectElement[] = [];
  for (let i = 0; i < MAX_HEADS; i++) {
    const ink = svgEl('rect', 'swarm-frame__ink', svg);
    // pathLength=1 hace que el largo de los trazos se lea como fracción del borde completo.
    ink.setAttribute('pathLength', '1');
    inks.push(ink);
  }

  const clip = el('div', 'swarm-frame__clip', root);
  const scanEl = el('div', 'swarm-frame__scan', clip);

  // Esquinas + puntos medios de los bordes (los medios solo si la caja es lo bastante grande).
  const handleDefs: [string, string, 'x' | 'y' | null][] = [
    ['0', '0', null],
    ['100%', '0', null],
    ['0', '100%', null],
    ['100%', '100%', null],
    ['50%', '0', 'x'],
    ['50%', '100%', 'x'],
    ['0', '50%', 'y'],
    ['100%', '50%', 'y'],
  ];
  const handles = handleDefs.map(([left, top, mid]) => {
    const node = el('i', 'swarm-frame__h', root);
    node.style.left = left;
    node.style.top = top;
    return { node, mid };
  });

  const tag = el('span', 'swarm-frame__tag', root);
  tag.style.display = 'none'; // vacía hasta que el borde empiece a cerrarse: una etiqueta vacía se ve como un bloque cian suelto

  return {
    update(rect, s) {
      const x = Math.round(rect.left * 10) / 10;
      const y = Math.round(rect.top * 10) / 10;
      if (x !== lx || y !== ly) {
        root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        // Una etiqueta sobre la caja sobresaldría por arriba de la página: se coloca dentro.
        root.classList.toggle('swarm-frame--inside', y < 20);
        lx = x;
        ly = y;
      }

      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w !== lw || h !== lh) {
        root.style.width = `${w}px`;
        root.style.height = `${h}px`;
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        for (const r of [ghost, ...inks]) {
          r.setAttribute('x', '0.5');
          r.setAttribute('y', '0.5');
          r.setAttribute('width', String(Math.max(1, w - 1)));
          r.setAttribute('height', String(Math.max(1, h - 1)));
        }
        for (const hd of handles) {
          const show = hd.mid === null || (hd.mid === 'x' ? w > 140 : h > 90);
          hd.node.style.display = show ? '' : 'none';
        }
        lw = w;
        lh = h;
      }

      const alpha = Math.round(s.alpha * 100) / 100;
      if (alpha !== lAlpha) {
        root.style.opacity = String(alpha);
        lAlpha = alpha;
      }

      const heads = Math.max(1, Math.min(MAX_HEADS, s.heads));
      for (let i = 0; i < MAX_HEADS; i++) {
        const dash = i < heads ? `${(s.inked / heads).toFixed(4)} 1` : '0 1';
        const offset = i < heads ? String(-(i / heads)) : '0';
        const key = `${dash}|${offset}`;
        if (lInk[i] !== key) {
          inks[i].style.strokeDasharray = dash;
          inks[i].style.strokeDashoffset = offset;
          lInk[i] = key;
        }
      }

      const handle = Math.round(smoothstep(0.8, 1, s.inked) * 100) / 100;
      if (handle !== lHandle) {
        root.style.setProperty('--swarm-h', String(handle));
        lHandle = handle;
      }

      // El tamaño en píxeles va subiendo a medida que el borde se cierra.
      const text = s.inked > 0.02 ? `${s.label ? `${s.label} · ` : ''}${Math.round(w * s.inked)}×${Math.round(h * s.inked)}` : '';
      if (text !== lText) {
        tag.textContent = text;
        tag.style.display = text ? '' : 'none';
        lText = text;
      }

      const scan = s.scan !== null && s.scan > 0 && s.scan < 1 ? Math.round(s.scan * 500) / 500 : -1;
      if (scan !== lScan) {
        if (scan < 0) {
          scanEl.style.opacity = '0';
        } else {
          scanEl.style.opacity = String(1 - scan ** 3);
          scanEl.style.transform = `translateY(${(h * scan - SCAN_BAND).toFixed(1)}px)`;
        }
        lScan = scan;
      }
    },
    remove() {
      root.remove();
    },
  };
}
