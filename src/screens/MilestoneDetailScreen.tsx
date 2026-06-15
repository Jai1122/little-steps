import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, DomainChip, PrimaryButton, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { getMilestoneById, bucketLabel } from '@/content';
import { useProgress } from '@/store';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MilestoneDetail'>;

export default function MilestoneDetailScreen({ route }: Props) {
  const milestone = getMilestoneById(route.params.milestoneId);
  const { isAchieved, toggle } = useProgress();

  if (!milestone) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Milestone not found" />
      </Screen>
    );
  }

  const achieved = isAchieved(milestone.id);

  return (
    <Screen>
      <View style={styles.chipsRow}>
        <DomainChip domain={milestone.domain} />
        <View style={styles.bucketChip}>
          <Text style={styles.bucketText}>{bucketLabel(milestone.ageBucket)}</Text>
        </View>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {milestone.title}
      </Text>
      <Text style={styles.desc}>{milestone.description}</Text>

      <View style={styles.rangeCard}>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.rangeText}>
          Most babies: <Text style={styles.rangeStrong}>{milestone.typicalRange}</Text>
        </Text>
      </View>

      {milestone.rangeNote ? (
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={18} color={theme.colors.accent} />
          <Text style={styles.noteText}>{milestone.rangeNote}</Text>
        </View>
      ) : null}

      <View style={[styles.statusCard, achieved && styles.statusCardDone]}>
        <Ionicons
          name={achieved ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={achieved ? theme.colors.success : theme.colors.textMuted}
        />
        <Text style={styles.statusText}>{achieved ? 'Achieved' : 'Not tracked yet'}</Text>
      </View>

      <PrimaryButton
        label={achieved ? 'Mark as not yet' : 'Mark as achieved'}
        variant={achieved ? 'secondary' : 'primary'}
        onPress={() => toggle(milestone.id)}
      />

      <Text style={styles.disclaimer}>
        Every baby develops at their own pace. This is general guidance, not medical advice — check
        with your pediatrician with any concerns.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  bucketChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
  },
  bucketText: { ...theme.typography.caption, color: theme.colors.text, fontWeight: '700' },
  title: { ...theme.typography.title, marginTop: theme.spacing.lg },
  desc: { ...theme.typography.body, marginTop: theme.spacing.md },
  rangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  rangeText: { ...theme.typography.body, color: theme.colors.text },
  rangeStrong: { fontWeight: '700' },
  noteCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  noteText: { ...theme.typography.body, flex: 1, color: theme.colors.text },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  statusCardDone: { backgroundColor: theme.colors.primarySoft },
  statusText: theme.typography.subheading,
  disclaimer: { ...theme.typography.caption, marginTop: theme.spacing.xl },
});
