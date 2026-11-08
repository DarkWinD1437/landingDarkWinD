export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function smoothstep(edge0: number, edge1: number, v: number) {
  const t = clamp((v - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** 0 → 1 → 0 ping-pong over each unit of `t`. */
export const triangle = (t: number) => Math.abs(2 * (t - Math.floor(t)) - 1);

/** Shortest signed distance between two angles, in (-π, π]. */
export function wrapAngle(a: number) {
  const TAU = Math.PI * 2;
  return a - TAU * Math.round(a / TAU);
}
