import { TextStyle } from 'react-native';
import { palette } from './colors';

/**
 * Typography scale. Uses the platform system font for now (rounded, friendly
 * custom font can be added later via expo-font without changing call sites).
 * Sizes are dynamic-type friendly; consumers should allow text to scale.
 */
export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: palette.text },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: palette.text },
  heading: { fontSize: 19, lineHeight: 25, fontWeight: '700', color: palette.text },
  subheading: { fontSize: 16, lineHeight: 22, fontWeight: '600', color: palette.text },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400', color: palette.text },
  bodyMuted: { fontSize: 15, lineHeight: 22, fontWeight: '400', color: palette.textMuted },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500', color: palette.textMuted },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '700', color: palette.text },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
