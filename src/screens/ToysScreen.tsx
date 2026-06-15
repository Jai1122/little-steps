import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Card, DomainChip, Illustration, EmptyState } from '@/components/ui';
import { theme } from '@/theme';
import { useProfile } from '@/store';
import { bucketLabel, getToysForBucket } from '@/content';
import { TabScreenNavigation } from '@/navigation/types';

export default function ToysScreen() {
  const navigation = useNavigation<TabScreenNavigation<'Toys'>>();
  const { child, bucket } = useProfile();

  if (!child || !bucket) return null;

  const toys = getToysForBucket(bucket);

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Toys
      </Text>
      <Text style={styles.subtitle}>Age-appropriate ideas for {bucketLabel(bucket)}</Text>

      {toys.length === 0 ? (
        <EmptyState icon="cube-outline" title="No toy ideas yet" message="Check back soon." />
      ) : (
        toys.map((t) => (
          <Card
            key={t.id}
            style={styles.card}
            onPress={() => navigation.navigate('ToyDetail', { toyId: t.id })}
            accessibilityLabel={`Toy: ${t.title}. ${t.benefit}`}
          >
            <Illustration imageKey={t.image} domain={t.domains[0]} height={120} />
            <Text style={styles.cardTitle}>{t.title}</Text>
            <Text style={styles.cardDesc}>{t.description}</Text>
            <View style={styles.chipsRow}>
              {t.domains.map((d) => (
                <DomainChip key={d} domain={d} />
              ))}
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: theme.typography.title,
  subtitle: { ...theme.typography.bodyMuted, marginTop: 2, marginBottom: theme.spacing.lg },
  card: { marginBottom: theme.spacing.lg },
  cardTitle: { ...theme.typography.subheading, marginTop: theme.spacing.md },
  cardDesc: { ...theme.typography.bodyMuted, marginTop: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.md },
});
