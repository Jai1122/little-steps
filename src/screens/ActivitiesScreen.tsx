import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, DomainChip, Illustration, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { useProfile } from '@/store';
import {
  bucketLabel,
  getActivitiesForBucket,
  DOMAINS,
  DOMAIN_LABELS,
  Domain,
} from '@/content';
import { TabScreenNavigation } from '@/navigation/types';

type Filter = Domain | 'all';

export default function ActivitiesScreen() {
  const navigation = useNavigation<TabScreenNavigation<'Activities'>>();
  const { child, bucket } = useProfile();
  const [filter, setFilter] = useState<Filter>('all');

  const activities = useMemo(
    () => (bucket ? getActivitiesForBucket(bucket) : []),
    [bucket],
  );

  // Only show filters for domains that actually appear in this bucket.
  const availableDomains = useMemo(() => {
    const present = new Set(activities.flatMap((a) => a.domains));
    return DOMAINS.filter((d) => present.has(d));
  }, [activities]);

  const filtered = useMemo(
    () => (filter === 'all' ? activities : activities.filter((a) => a.domains.includes(filter))),
    [activities, filter],
  );

  if (!child || !bucket) return null;

  const chips: Filter[] = ['all', ...availableDomains];

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Activities
      </Text>
      <Text style={styles.subtitle}>Play ideas for {bucketLabel(bucket)}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {chips.map((c) => {
          const active = filter === c;
          return (
            <Pressable
              key={c}
              onPress={() => setFilter(c)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {c === 'all' ? 'All' : DOMAIN_LABELS[c]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState
          icon="color-palette-outline"
          title="No activities here"
          message="Try a different filter."
        />
      ) : (
        filtered.map((a) => (
          <Card
            key={a.id}
            style={styles.card}
            onPress={() => navigation.navigate('ActivityDetail', { activityId: a.id })}
            accessibilityLabel={`Activity: ${a.title}. ${a.summary}`}
          >
            <Illustration imageKey={a.image} domain={a.domains[0]} height={130} />
            <Text style={styles.cardTitle}>{a.title}</Text>
            <Text style={styles.cardSummary}>{a.summary}</Text>
            <View style={styles.metaRow}>
              {a.durationMin ? (
                <View style={styles.duration}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.durationText}>{a.durationMin} min</Text>
                </View>
              ) : null}
              <View style={styles.chipsRow}>
                {a.domains.map((d) => (
                  <DomainChip key={d} domain={d} />
                ))}
              </View>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: theme.typography.title,
  subtitle: { ...theme.typography.bodyMuted, marginTop: 2, marginBottom: theme.spacing.md },
  filters: { gap: theme.spacing.sm, paddingBottom: theme.spacing.lg, paddingRight: theme.spacing.lg },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { ...theme.typography.caption, color: theme.colors.text, fontWeight: '700' },
  filterTextActive: { color: theme.colors.textInverse },
  card: { marginBottom: theme.spacing.lg },
  cardTitle: { ...theme.typography.subheading, marginTop: theme.spacing.md },
  cardSummary: { ...theme.typography.bodyMuted, marginTop: 4 },
  metaRow: { marginTop: theme.spacing.md, gap: theme.spacing.sm },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: theme.typography.caption,
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
});
