import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Checkbox, ProgressRing, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { useProfile, useProgress } from '@/store';
import {
  bucketLabel,
  getMilestonesForBucket,
  getMilestonesByDomain,
  DOMAIN_LABELS,
  Milestone,
} from '@/content';
import { TabScreenNavigation } from '@/navigation/types';

export default function MilestonesScreen() {
  const navigation = useNavigation<TabScreenNavigation<'Milestones'>>();
  const { child, bucket } = useProfile();
  const { isAchieved, toggle, achievedCount } = useProgress();

  if (!child || !bucket) return null;

  const all = getMilestonesForBucket(bucket);
  const groups = getMilestonesByDomain(bucket);
  const achieved = achievedCount(all.map((m) => m.id));

  const renderRow = (m: Milestone) => {
    const checked = isAchieved(m.id);
    return (
      <View key={m.id} style={styles.row}>
        <Checkbox
          checked={checked}
          onToggle={() => toggle(m.id)}
          accessibilityLabel={`${m.title}. ${checked ? 'Achieved' : 'Not yet'}`}
        />
        <Pressable
          style={styles.rowText}
          onPress={() => navigation.navigate('MilestoneDetail', { milestoneId: m.id })}
          accessibilityRole="button"
          accessibilityLabel={`${m.title}. More about this milestone.`}
        >
          <Text style={[styles.rowTitle, checked && styles.rowTitleChecked]}>{m.title}</Text>
          <Text style={styles.rowDesc} numberOfLines={2}>
            {m.description}
          </Text>
          <Text style={styles.rowRange}>Most babies: {m.typicalRange}</Text>
        </Pressable>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
      </View>
    );
  };

  return (
    <Screen>
      <Card style={styles.summary}>
        <ProgressRing achieved={achieved} total={all.length} size={80} strokeWidth={9} />
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>{bucketLabel(bucket)} milestones</Text>
          <Text style={styles.summarySub}>
            {achieved} of {all.length} tracked. Check off what {child.name} can do — there's no
            rush.
          </Text>
        </View>
      </Card>

      {groups.length === 0 ? (
        <EmptyState icon="checkmark-circle-outline" title="No milestones yet" message="Check back soon." />
      ) : (
        groups.map((group) => (
          <View key={group.domain} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={[styles.domainDot, { backgroundColor: theme.domainColors[group.domain].base }]} />
              <Text style={styles.groupTitle}>{DOMAIN_LABELS[group.domain]}</Text>
            </View>
            <Card style={styles.groupCard}>
              {group.items.map((m, i) => (
                <View key={m.id}>
                  {i > 0 ? <View style={styles.divider} /> : null}
                  {renderRow(m)}
                </View>
              ))}
            </Card>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  summaryText: { flex: 1, marginLeft: theme.spacing.lg },
  summaryTitle: theme.typography.subheading,
  summarySub: { ...theme.typography.bodyMuted, marginTop: 4 },
  group: { marginBottom: theme.spacing.xl },
  groupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  domainDot: { width: 9, height: 9, borderRadius: theme.radius.pill, marginRight: theme.spacing.sm },
  groupTitle: theme.typography.heading,
  groupCard: { padding: 0 },
  row: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  rowText: { flex: 1, marginHorizontal: theme.spacing.md },
  rowTitle: theme.typography.subheading,
  rowTitleChecked: { color: theme.colors.textMuted, textDecorationLine: 'line-through' },
  rowDesc: { ...theme.typography.caption, marginTop: 2 },
  rowRange: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '700', marginTop: 4 },
  divider: { height: 1, backgroundColor: theme.colors.border, marginLeft: theme.spacing.md },
});
