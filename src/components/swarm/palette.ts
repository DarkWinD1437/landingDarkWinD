/**
 * Colours mirror the dossier tokens in `index.css` (cyan accent, coral primary,
 * near-white foreground, dark surface). Canvas parses `oklch()` natively in
 * every current browser, so no hex translation is needed.
 */
export interface SchoolStyle {
  /** Fill colour of the cursor arrows in this school. */
  color: string;
  glow: string;
  /** Cursors in the school on desktop (mobile gets ~60%). */
  count: number;
  /** Size relative to the base arrow. */
  scale: number;
}

export const SCHOOL_STYLES: readonly SchoolStyle[] = [
  { color: 'oklch(0.76 0.14 200)', glow: 'oklch(0.76 0.14 200 / 0.6)', count: 11, scale: 1.1 },
  { color: 'oklch(0.72 0.17 26)', glow: 'oklch(0.72 0.17 26 / 0.6)', count: 10, scale: 1 },
  { color: 'oklch(0.96 0.01 262)', glow: 'oklch(0.96 0.01 262 / 0.45)', count: 9, scale: 1.2 },
];

export const FRAME_COLOR = 'oklch(0.76 0.14 200)';
export const FRAME_DIM = 'oklch(0.76 0.14 200 / 0.38)';
export const FRAME_GLOW = 'oklch(0.76 0.14 200 / 0.16)';
export const FRAME_INK = 'oklch(0.13 0.012 262)';
export const FRAME_FONT = '600 10px "JetBrains Mono", ui-monospace, monospace';
