/**
 * Los colores reflejan los tokens del dossier en `index.css` (acento cian, primario
 * coral, primer plano casi blanco, superficie oscura). El canvas interpreta
 * `oklch()` de forma nativa en todos los navegadores actuales, así que no hace
 * falta traducirlos a hex.
 */
export interface SchoolStyle {
  /** Color de relleno de las flechas de este cardumen. */
  color: string;
  glow: string;
  /** Cursores del cardumen en escritorio (en móvil, ~60%). */
  count: number;
  /** Tamaño relativo a la flecha base. */
  scale: number;
}

export const SCHOOL_STYLES: readonly SchoolStyle[] = [
  { color: 'oklch(0.76 0.14 200)', glow: 'oklch(0.76 0.14 200 / 0.6)', count: 11, scale: 1.1 },
  { color: 'oklch(0.72 0.17 26)', glow: 'oklch(0.72 0.17 26 / 0.6)', count: 10, scale: 1 },
  { color: 'oklch(0.96 0.01 262)', glow: 'oklch(0.96 0.01 262 / 0.45)', count: 9, scale: 1.2 },
];

/** Tinta oscura del contorno del cursor (los colores del marco están en dossier.css). */
export const FRAME_INK = 'oklch(0.13 0.012 262)';
