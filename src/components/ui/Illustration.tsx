import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Domain } from '@/content';
import { iconForImageKey } from './illustrationMap';

type Props = {
  imageKey: string;
  /** Drives the tile's accent color; falls back to a deterministic pastel. */
  domain?: Domain;
  /** Height of the tile. Width fills its container. */
  height?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
};

const FALLBACK_TINTS = [
  theme.colors.primarySoft,
  theme.colors.secondarySoft,
  theme.colors.accentSoft,
  theme.colors.surfaceAlt,
] as const;

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Placeholder illustration: a soft pastel tile with a representative icon.
 * Decorative, so hidden from screen readers (the card title conveys meaning).
 * Real artwork can replace this later keyed by the same `imageKey`.
 */
export function Illustration({ imageKey, domain, height = 120, iconSize = 40, style }: Props) {
  const icon = iconForImageKey(imageKey);
  const background = domain
    ? theme.domainColors[domain].soft
    : FALLBACK_TINTS[hashString(imageKey) % FALLBACK_TINTS.length];
  const iconColor = domain ? theme.domainColors[domain].base : theme.colors.primary;

  return (
    <View
      style={[styles.tile, { height, backgroundColor: background }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
