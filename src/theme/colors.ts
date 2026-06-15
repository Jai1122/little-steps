/**
 * LittleSteps color palette — soft pastel, calming, WCAG-AA-conscious for text.
 * Text on background/surface targets AA contrast (>= 4.5:1 for body text).
 */

export const palette = {
  // Brand
  primary: '#5DA47F', // sage/mint green (AA on white for text/icons)
  primaryLight: '#88C9A1',
  primarySoft: '#E4F1E9', // tinted surface
  secondary: '#E08A66', // warm peach (AA on white)
  secondarySoft: '#FBE7DE',
  accent: '#7C6FB0', // soft lavender (AA on white)
  accentSoft: '#ECE8F6',

  // Neutrals
  background: '#FBF8F3', // warm off-white
  surface: '#FFFFFF',
  surfaceAlt: '#F3EFE8',
  border: '#E7E0D6',

  // Text (dark slate family)
  text: '#33333D',
  textMuted: '#6E6E7A',
  textInverse: '#FFFFFF',

  // Status
  success: '#3F8F66',
  warning: '#C9871F',
  danger: '#C0594B',

  // Misc
  shadow: '#000000',
  overlay: 'rgba(51, 51, 61, 0.45)',
} as const;

import type { Domain } from '@/content/types';

export type DomainColor = { base: string; soft: string; text: string };

/**
 * Developmental domain accent colors. Keyed by the canonical `Domain` type from
 * the content layer, so this map must stay exhaustive if domains change. Kept
 * muted and always paired with a text label (never color alone) for a11y.
 */
export const domainColors: Record<Domain, DomainColor> = {
  motor: { base: '#E08A66', soft: '#FBE7DE', text: '#8A3D1F' },
  cognitive: { base: '#7C6FB0', soft: '#ECE8F6', text: '#473C73' },
  social: { base: '#C9871F', soft: '#FAEFD6', text: '#74500F' },
  language: { base: '#3F8F66', soft: '#E4F1E9', text: '#1F5238' },
};

/** @deprecated Use `Domain` from `@/content`. Kept as an alias for convenience. */
export type DomainKey = Domain;
