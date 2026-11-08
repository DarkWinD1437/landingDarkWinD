import { FRAME_INK } from './palette';

/**
 * El puntero del mouse en pantalla (la flecha clásica) convertido en "pez": la
 * punta va adelante, la cola con muesca queda atrás y todo el cuerpo ondula al nadar.
 *
 * La flecha de cada cardumen se rasteriza una sola vez en un sprite (un
 * `drawImage` barato por frame, brillo incluido); solo el vaivén se anima en vivo.
 */

/** Flecha clásica, con la punta en el origen y apuntando arriba-izquierda como el cursor del sistema. */
const ARROW: readonly (readonly [number, number])[] = [
  [0, 0],
  [0, 17],
  [4.1, 13.1],
  [6.9, 19.6],
  [9.5, 18.5],
  [6.7, 12.2],
  [12, 12],
];

/** Centro visual de la flecha, para que gire sobre su punto medio. */
const CENTRE_X = 4.6;
const CENTRE_Y = 10.2;

/**
 * Rotación que convierte "punta arriba-izquierda" en "punta hacia +x". La punta
 * apunta en sentido contrario al vector punta→centro, así que girar ese vector
 * hasta -x lo logra.
 */
const POINT_RIGHT = Math.PI - Math.atan2(CENTRE_Y, CENTRE_X);

const PAD = 8;
const EXTENT = 26; // cuadrado holgado donde cabe la flecha con cualquier rotación

export interface MouseSprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export function createSprite(fill: string, glow: string, density: number): MouseSprite {
  const width = EXTENT + PAD * 2;
  const height = EXTENT + PAD * 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * density);
  canvas.height = Math.ceil(height * density);

  const g = canvas.getContext('2d');
  if (!g) return { canvas, width, height };

  g.scale(density, density);
  g.translate(width / 2, height / 2); // origen = centro de la flecha, +x = dirección de nado
  g.rotate(POINT_RIGHT);
  g.translate(-CENTRE_X, -CENTRE_Y);

  g.beginPath();
  ARROW.forEach(([x, y], i) => (i === 0 ? g.moveTo(x, y) : g.lineTo(x, y)));
  g.closePath();

  g.lineJoin = 'round';
  g.shadowColor = glow;
  g.shadowBlur = 9;
  g.fillStyle = fill;
  g.fill();
  g.shadowBlur = 0;
  g.lineWidth = 1.5;
  g.strokeStyle = FRAME_INK;
  g.stroke();

  return { canvas, width, height };
}

export interface MouseDrawState {
  x: number;
  y: number;
  heading: number;
  size: number;
  phase: number;
  speed: number;
}

export function drawMouse(ctx: CanvasRenderingContext2D, m: MouseDrawState, sprite: MouseSprite) {
  // Vaivén de pez: cuanto más rápido nada, más amplio el movimiento.
  const sway = Math.sin(m.phase) * (0.1 + Math.min(m.speed, 500) * 0.0004);

  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.heading + sway);
  ctx.scale(m.size, m.size);
  ctx.drawImage(sprite.canvas, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
  ctx.restore();
}
