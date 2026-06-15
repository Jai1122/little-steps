import { palette, domainColors, DomainKey } from './colors';
import { spacing, radius, MIN_TAP } from './spacing';
import { typography } from './typography';

export const theme = {
  colors: palette,
  domainColors,
  spacing,
  radius,
  typography,
  minTap: MIN_TAP,
} as const;

export type Theme = typeof theme;
export type { DomainKey };
export { palette, domainColors, spacing, radius, typography, MIN_TAP };
