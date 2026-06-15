import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  /** Optional element rendered on the right (e.g. a count or action). */
  right?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  textWrap: { flex: 1, paddingRight: theme.spacing.md },
  title: theme.typography.heading,
  subtitle: { ...theme.typography.bodyMuted, marginTop: 2 },
});
