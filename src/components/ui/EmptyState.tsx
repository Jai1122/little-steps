import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  icon?: IconName;
  title: string;
  message?: string;
};

/** Friendly empty/placeholder state for lists with no content. */
export function EmptyState({ icon = 'sparkles-outline', title, message }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: { ...theme.typography.subheading, textAlign: 'center' },
  message: {
    ...theme.typography.bodyMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
