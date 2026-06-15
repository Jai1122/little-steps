import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, ProgressRing, Illustration } from '@/components/ui';
import { theme } from '@/theme';
import { useProfile, useProgress } from '@/store';
import {
  bucketLabel,
  getMilestonesForBucket,
  getActivitiesForBucket,
  getCareTipsForBucket,
  CARE_CATEGORY_LABELS,
  CareCategory,
} from '@/content';
import { TabScreenNavigation } from '@/navigation/types';

type IconName = keyof typeof Ionicons.glyphMap;

const CARE_ICONS: Record<CareCategory, IconName> = {
  feeding: 'nutrition-outline',
  care: 'water-outline',
  culture: 'sparkles-outline',
  safety: 'shield-checkmark-outline',
};

const QUICK_ACTIONS: { tab: 'Milestones' | 'Activities' | 'Toys'; icon: IconName; label: string }[] = [
  { tab: 'Milestones', icon: 'checkmark-circle-outline', label: 'Milestones' },
  { tab: 'Activities', icon: 'color-palette-outline', label: 'Activities' },
  { tab: 'Toys', icon: 'cube-outline', label: 'Toys' },
];

export default function HomeScreen() {
  const navigation = useNavigation<TabScreenNavigation<'Home'>>();
  const { child, ageLabel, bucket, beyondSupportedRange } = useProfile();
  const { achievedCount } = useProgress();

  // ProfileProvider guarantees a child before Tabs render, but guard for safety.
  if (!child || !bucket) return null;

  const milestones = getMilestonesForBucket(bucket);
  const achieved = achievedCount(milestones.map((m) => m.id));
  const featured = getActivitiesForBucket(bucket)[0];
  const tips = getCareTipsForBucket(bucket).slice(0, 3);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          {child.photoUri ? (
            <Image source={{ uri: child.photoUri }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <Ionicons name="happy-outline" size={26} color={theme.colors.primary} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.hi}>Hi {child.name}!</Text>
          <Text style={styles.age}>
            {ageLabel} · {bucketLabel(bucket)}
          </Text>
        </View>
      </View>

      {beyondSupportedRange ? (
        <Card style={styles.noteCard}>
          <Text style={styles.noteText}>
            {child.name} is past 12 months — you're seeing our 12-month guidance. More age ranges
            are coming soon!
          </Text>
        </Card>
      ) : null}

      <Card
        style={styles.progressCard}
        onPress={() => navigation.navigate('Milestones')}
        accessibilityLabel={`Milestone progress: ${achieved} of ${milestones.length} tracked. Opens milestones.`}
      >
        <ProgressRing achieved={achieved} total={milestones.length} />
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>This stage's milestones</Text>
          <Text style={styles.progressSub}>
            {achieved === 0
              ? `Tap to track what ${child.name} can do.`
              : `You've tracked ${achieved} of ${milestones.length}. Keep going!`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </Card>

      {featured ? (
        <>
          <Text style={styles.sectionLabel}>This week's focus</Text>
          <Card
            onPress={() => navigation.navigate('ActivityDetail', { activityId: featured.id })}
            accessibilityLabel={`Activity: ${featured.title}. ${featured.summary}`}
            style={styles.featuredCard}
          >
            <Illustration imageKey={featured.image} domain={featured.domains[0]} height={130} />
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredSummary}>{featured.summary}</Text>
          </Card>
        </>
      ) : null}

      {tips.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>For this stage</Text>
          {tips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIcon}>
                  <Ionicons name={CARE_ICONS[tip.category]} size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.tipCategory}>{CARE_CATEGORY_LABELS[tip.category]}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
            </Card>
          ))}
          <Text style={styles.tipDisclaimer}>
            General guidance for Indian families — not medical advice. Please check with your
            pediatrician.
          </Text>
        </>
      ) : null}

      <Text style={styles.sectionLabel}>Explore</Text>
      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((action) => (
          <Card
            key={action.tab}
            style={styles.quickCard}
            onPress={() => navigation.navigate(action.tab)}
            accessibilityLabel={`Open ${action.label}`}
          >
            <View style={styles.quickIcon}>
              <Ionicons name={action.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickLabel}>{action.label}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 52, height: 52 },
  headerText: { marginLeft: theme.spacing.md, flex: 1 },
  hi: theme.typography.title,
  age: { ...theme.typography.bodyMuted, marginTop: 2 },
  noteCard: { backgroundColor: theme.colors.secondarySoft, borderColor: theme.colors.secondarySoft, marginBottom: theme.spacing.lg },
  noteText: { ...theme.typography.caption, color: theme.colors.text },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressText: { flex: 1, marginLeft: theme.spacing.lg },
  progressTitle: theme.typography.subheading,
  progressSub: { ...theme.typography.bodyMuted, marginTop: 4 },
  sectionLabel: { ...theme.typography.heading, marginBottom: theme.spacing.md },
  tipCard: { marginBottom: theme.spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  tipCategory: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '700' },
  tipTitle: theme.typography.subheading,
  tipBody: { ...theme.typography.bodyMuted, marginTop: 4 },
  tipDisclaimer: { ...theme.typography.caption, marginBottom: theme.spacing.xl },
  featuredCard: { marginBottom: theme.spacing.xl },
  featuredTitle: { ...theme.typography.subheading, marginTop: theme.spacing.md },
  featuredSummary: { ...theme.typography.bodyMuted, marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: theme.spacing.md },
  quickCard: { flex: 1, alignItems: 'center', paddingVertical: theme.spacing.lg },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickLabel: { ...theme.typography.caption, color: theme.colors.text, fontWeight: '700' },
});
