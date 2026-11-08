import { FRAME_INK } from './palette';

/**
 * The on-screen mouse pointer (the classic arrow cursor) as a "fish": the tip
 * leads, the notched tail trails behind, and the whole body sways as it swims.
 *
 * Each school's arrow is rasterised once into a sprite (cheap `drawImage` per
 * frame, glow included); only the sway is animated live.
 */

/** Classic arrow, tip at the origin, drawn pointing up-left like the OS cursor. */
const ARROW: readonly (readonly [number, number])[] = [
  [0, 0],
  [0, 17],
  [4.1, 13.1],
  [6.9, 19.6],
  [9.5, 18.5],
  [6.7, 12.2],
  [12, 12],
];

/** Visual centre of the arrow, so it rotates about its middle. */
const CENTRE_X = 4.6;
const CENTRE_Y = 10.2;

/**
 * Rotation that turns "tip up-left" into "tip along +x". The tip points opposite
 * to the tip→centre vector, so rotating that vector onto -x does the job.
 */
const POINT_RIGHT = Math.PI - Math.atan2(CENTRE_Y, CENTRE_X);

const PAD = 8;
const EXTENT = 26; // generous square that fits the arrow at any rotation

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
  g.translate(width / 2, height / 2); // origin = arrow centre, +x = swimming direction
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
  // Fish-like sway: the faster it swims, the wider the wag.
  const sway = Math.sin(m.phase) * (0.1 + Math.min(m.speed, 500) * 0.0004);

  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.heading + sway);
  ctx.scale(m.size, m.size);
  ctx.drawImage(sprite.canvas, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
  ctx.restore();
}
