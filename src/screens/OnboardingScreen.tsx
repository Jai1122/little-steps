import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui';
import { ProfileForm } from '@/components/ProfileForm';
import { useProfile } from '@/store';
import { theme } from '@/theme';

export default function OnboardingScreen() {
  const { saveChild } = useProfile();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="leaf-outline" size={30} color={theme.colors.primary} />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Welcome to LittleSteps
        </Text>
        <Text style={styles.subtitle}>
          Track your baby's milestones and discover age-appropriate activities. Let's set up
          their profile.
        </Text>
      </View>

      <ProfileForm submitLabel="Get started" onSubmit={saveChild} />

      <Text style={styles.disclaimer}>
        LittleSteps offers general guidance, not medical advice. Every baby grows at their own
        pace — talk to your pediatrician with any concerns.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: theme.spacing.lg },
  logo: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: { ...theme.typography.title, textAlign: 'center' },
  subtitle: {
    ...theme.typography.bodyMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  disclaimer: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
