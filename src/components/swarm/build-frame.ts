import { FRAME_COLOR, FRAME_DIM, FRAME_FONT, FRAME_GLOW, FRAME_INK } from './palette';
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
 * Point on a rectangle's perimeter, `s` px from the top-left corner going
 * clockwise. Wraps, so heads and their followers can cross the start corner.
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

/** Strokes the stretch [a, b] (px along the perimeter, a ≤ b ≤ P) of the rect. */
function strokeSpan(ctx: CanvasRenderingContext2D, r: Rect, a: number, b: number) {
  const { left: x, top: y, width: w, height: h } = r;
  const edges: [number, number, number, number, number][] = [
    [x, y, x + w, y, w],
    [x + w, y, x + w, y + h, h],
    [x + w, y + h, x, y + h, w],
    [x, y + h, x, y, h],
  ];

  let offset = 0;
  let started = false;
  ctx.beginPath();
  for (const [x0, y0, x1, y1, len] of edges) {
    const s = Math.max(a, offset);
    const e = Math.min(b, offset + len);
    if (e > s) {
      const t0 = (s - offset) / len;
      const t1 = (e - offset) / len;
      const sx = x0 + (x1 - x0) * t0;
      const sy = y0 + (y1 - y0) * t0;
      if (started) ctx.lineTo(sx, sy);
      else ctx.moveTo(sx, sy);
      ctx.lineTo(x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1);
      started = true;
    }
    offset += len;
  }
  ctx.stroke();
}

function strokeRange(ctx: CanvasRenderingContext2D, r: Rect, start: number, length: number) {
  const P = 2 * (r.width + r.height);
  if (length <= 0) return;
  if (length >= P) {
    strokeSpan(ctx, r, 0, P);
    return;
  }
  const a = ((start % P) + P) % P;
  const b = a + length;
  if (b > P) {
    strokeSpan(ctx, r, a, P);
    strokeSpan(ctx, r, 0, b - P);
  } else {
    strokeSpan(ctx, r, a, b);
  }
}

export interface FrameOptions {
  label: string;
  /** How many heads are inking the border in parallel (each covers 1/heads of it). */
  heads: number;
  /** Border ink progress, 0 → 1. */
  inked: number;
  /** Reveal progress, 0 → 1, drives the scan line. `null` once finished. */
  scan: number | null;
  /** Thin dividers get a lightweight line + end ticks instead of a full frame. */
  line: boolean;
  alpha: number;
}

/**
 * The "construction frame": a dashed ghost of the component's box appears the
 * moment the swarm picks it up, the mice ink it solid, and a size tag counts
 * up to the real pixel dimensions — so you can read each component's size at
 * the instant it is created.
 */
export function drawBuildFrame(ctx: CanvasRenderingContext2D, rect: Rect, o: FrameOptions) {
  if (o.alpha <= 0.01 || rect.width < 1 || rect.height < 1) return;

  // Pixel-snapped so 1px strokes stay crisp.
  const r: Rect = {
    left: Math.round(rect.left) + 0.5,
    top: Math.round(rect.top) + 0.5,
    width: Math.max(1, Math.round(rect.width) - 1),
    height: Math.max(1, Math.round(rect.height) - 1),
  };

  ctx.save();
  ctx.globalAlpha = o.alpha;

  if (o.line) drawLineFrame(ctx, r, o);
  else drawBoxFrame(ctx, r, o);

  ctx.restore();
}

function drawLineFrame(ctx: CanvasRenderingContext2D, r: Rect, o: FrameOptions) {
  const cy = Math.round(r.top + r.height / 2) + 0.5;
  const right = r.left + r.width;

  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = FRAME_DIM;
  ctx.beginPath();
  ctx.moveTo(r.left, cy);
  ctx.lineTo(right, cy);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = FRAME_COLOR;
  ctx.beginPath();
  ctx.moveTo(r.left, cy);
  ctx.lineTo(r.left + r.width * o.inked, cy);
  ctx.stroke();

  // End ticks.
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(r.left, cy - 5);
  ctx.lineTo(r.left, cy + 5);
  ctx.moveTo(right, cy - 5);
  ctx.lineTo(right, cy + 5);
  ctx.stroke();
}

function drawBoxFrame(ctx: CanvasRenderingContext2D, r: Rect, o: FrameOptions) {
  // 1. Ghost outline — the reserved footprint.
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = FRAME_DIM;
  ctx.strokeRect(r.left, r.top, r.width, r.height);

  // 2. Solid ink laid down by the mice, each head covering an equal share.
  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = FRAME_COLOR;
  const P = 2 * (r.width + r.height);
  const heads = Math.max(1, o.heads);
  for (let i = 0; i < heads; i++) {
    strokeRange(ctx, r, (i / heads) * P, (o.inked / heads) * P);
  }

  // 3. Scan line sweeping across while the content materialises.
  if (o.scan !== null && o.scan > 0 && o.scan < 1) {
    const y = r.top + r.height * o.scan;
    const fade = 1 - o.scan ** 3;
    const band = Math.min(26, r.height * o.scan);
    const grad = ctx.createLinearGradient(0, y - band, 0, y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, FRAME_GLOW);
    ctx.fillStyle = grad;
    ctx.fillRect(r.left, y - band, r.width, band);

    ctx.globalAlpha = o.alpha * fade;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(r.left, y);
    ctx.lineTo(r.left + r.width, y);
    ctx.stroke();
    ctx.globalAlpha = o.alpha;
  }

  // 4. Resize handles, once the border has closed.
  const handleAlpha = smoothstep(0.8, 1, o.inked);
  if (handleAlpha > 0) {
    ctx.globalAlpha = o.alpha * handleAlpha;
    ctx.fillStyle = FRAME_INK;
    ctx.lineWidth = 1.2;
    const xs = [r.left, r.left + r.width];
    const ys = [r.top, r.top + r.height];
    if (r.width > 140) xs.push(r.left + r.width / 2);
    if (r.height > 90) ys.push(r.top + r.height / 2);
    for (const hx of xs) {
      for (const hy of ys) {
        // skip the centre of the box — handles live on the border only
        if (hx !== r.left && hx !== r.left + r.width && hy !== r.top && hy !== r.top + r.height) continue;
        ctx.fillRect(hx - 3, hy - 3, 6, 6);
        ctx.strokeRect(hx - 3, hy - 3, 6, 6);
      }
    }
    ctx.globalAlpha = o.alpha;
  }

  // 5. Size tag — the pixel dimensions count up as the border closes.
  if (o.inked > 0.02) {
    const w = Math.round((r.width + 1) * o.inked);
    const h = Math.round((r.height + 1) * o.inked);
    const text = `${o.label ? `${o.label} · ` : ''}${w}×${h}`;
    ctx.font = FRAME_FONT;
    const padX = 6;
    const chipH = 16;
    const chipW = Math.ceil(ctx.measureText(text).width) + padX * 2;
    let cx = r.left;
    let cy = r.top - chipH - 2;
    if (cy < 2) {
      cx = r.left + 4;
      cy = r.top + 4;
    }
    ctx.fillStyle = FRAME_COLOR;
    ctx.fillRect(cx, cy, chipW, chipH);
    ctx.fillStyle = FRAME_INK;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx + padX, cy + chipH / 2 + 0.5);
  }
}
