import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Domain, DOMAIN_LABELS } from '@/content';

/**
 * Small labelled pill for a developmental domain. Always shows the text label,
 * so meaning never depends on color alone (accessibility).
 */
export function DomainChip({ domain }: { domain: Domain }) {
  const c = theme.domainColors[domain];
  return (
    <View style={[styles.chip, { backgroundColor: c.soft }]}>
      <View style={[styles.dot, { backgroundColor: c.base }]} />
      <Text style={[styles.label, { color: c.text }]}>{DOMAIN_LABELS[domain]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.pill,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
