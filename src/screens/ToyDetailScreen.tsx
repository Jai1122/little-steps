import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, DomainChip, Illustration, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { getToyById } from '@/content';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ToyDetail'>;

export default function ToyDetailScreen({ route }: Props) {
  const toy = getToyById(route.params.toyId);

  if (!toy) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Toy not found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Illustration imageKey={toy.image} domain={toy.domains[0]} height={170} />
      <Text style={styles.title} accessibilityRole="header">
        {toy.title}
      </Text>
      <View style={styles.chipsRow}>
        {toy.domains.map((d) => (
          <DomainChip key={d} domain={d} />
        ))}
      </View>
      <Text style={styles.desc}>{toy.description}</Text>

      <View style={styles.whyCard}>
        <Text style={styles.whyTitle}>What it helps develop</Text>
        <Text style={styles.whyText}>{toy.benefit}</Text>
      </View>

      <Text style={styles.note}>
        Always choose toys labelled safe for your baby's age and check regularly for loose or
        small parts.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, marginTop: theme.spacing.lg },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  desc: { ...theme.typography.body, marginTop: theme.spacing.lg },
  whyCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  whyTitle: { ...theme.typography.subheading, color: theme.colors.primary },
  whyText: { ...theme.typography.body, marginTop: theme.spacing.xs },
  note: { ...theme.typography.caption, marginTop: theme.spacing.lg },
});
