import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, DomainChip, Illustration, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { getActivityById } from '@/content';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetail'>;

export default function ActivityDetailScreen({ route }: Props) {
  const activity = getActivityById(route.params.activityId);

  if (!activity) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Activity not found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Illustration imageKey={activity.image} domain={activity.domains[0]} height={170} />
      <Text style={styles.title} accessibilityRole="header">
        {activity.title}
      </Text>

      <View style={styles.metaRow}>
        {activity.durationMin ? (
          <View style={styles.duration}>
            <Ionicons name="time-outline" size={15} color={theme.colors.textMuted} />
            <Text style={styles.durationText}>{activity.durationMin} min</Text>
          </View>
        ) : null}
        <View style={styles.chipsRow}>
          {activity.domains.map((d) => (
            <DomainChip key={d} domain={d} />
          ))}
        </View>
      </View>

      <Text style={styles.summary}>{activity.summary}</Text>

      <Text style={styles.sectionTitle}>How to play</Text>
      {activity.steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{i + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <View style={styles.whyCard}>
        <Text style={styles.whyTitle}>Why it helps</Text>
        <Text style={styles.whyText}>{activity.whyItHelps}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, marginTop: theme.spacing.lg },
  metaRow: { marginTop: theme.spacing.md, gap: theme.spacing.sm },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: theme.typography.caption,
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  summary: { ...theme.typography.body, marginTop: theme.spacing.lg },
  sectionTitle: { ...theme.typography.heading, marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.md },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: { ...theme.typography.label, color: theme.colors.primary },
  stepText: { ...theme.typography.body, flex: 1 },
  whyCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  whyTitle: { ...theme.typography.subheading, color: theme.colors.accent },
  whyText: { ...theme.typography.body, marginTop: theme.spacing.xs },
});
