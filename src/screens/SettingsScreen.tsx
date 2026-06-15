import React from 'react';
import { View, Text, StyleSheet, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, PrimaryButton } from '@/components/ui';
import { theme } from '@/theme';
import { useProfile, useSettings } from '@/store';
import { bucketLabel } from '@/content';
import {
  ensureNotificationPermission,
  scheduleWeeklyReminder,
  cancelReminders,
} from '@/notifications/reminders';
import { TabScreenNavigation } from '@/navigation/types';

export default function SettingsScreen() {
  const navigation = useNavigation<TabScreenNavigation<'Settings'>>();
  const { child, ageLabel, bucket, clearChild } = useProfile();
  const { settings, updateSettings } = useSettings();

  const onToggleReminders = async (enabled: boolean) => {
    if (enabled) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Notifications are off',
          'Enable notifications for LittleSteps in your device settings to get weekly reminders.',
        );
        return;
      }
      await scheduleWeeklyReminder(child?.name);
      updateSettings({ remindersEnabled: true });
    } else {
      await cancelReminders();
      updateSettings({ remindersEnabled: false });
    }
  };

  const confirmReset = () => {
    Alert.alert(
      'Start over?',
      "This removes the current profile and tracked milestones from this device. You'll set up a new profile.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start over', style: 'destructive', onPress: clearChild },
      ],
    );
  };

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Settings
      </Text>

      {child ? (
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            {child.photoUri ? (
              <Image source={{ uri: child.photoUri }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <Ionicons name="happy-outline" size={26} color={theme.colors.primary} />
            )}
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{child.name}</Text>
            <Text style={styles.meta}>
              {ageLabel}
              {bucket ? ` · ${bucketLabel(bucket)}` : ''}
            </Text>
          </View>
        </Card>
      ) : null}

      <PrimaryButton
        label="Edit profile"
        variant="secondary"
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.action}
      />

      <Card style={styles.reminderCard}>
        <View style={styles.reminderText}>
          <Text style={styles.reminderTitle}>Weekly reminder</Text>
          <Text style={styles.reminderSub}>A gentle nudge each week to check what's new.</Text>
        </View>
        <Switch
          value={settings.remindersEnabled}
          onValueChange={onToggleReminders}
          trackColor={{ true: theme.colors.primaryLight, false: theme.colors.border }}
          thumbColor={settings.remindersEnabled ? theme.colors.primary : undefined}
          accessibilityLabel="Weekly reminder"
        />
      </Card>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About LittleSteps</Text>
        <Text style={styles.aboutText}>
          LittleSteps offers general, age-based guidance to help you enjoy and support your baby's
          development. It is not medical advice. Every baby grows at their own pace — please talk to
          your pediatrician with any questions or concerns.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <PrimaryButton
        label="Start over"
        variant="secondary"
        onPress={confirmReset}
        style={styles.danger}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...theme.typography.title, marginBottom: theme.spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center' },
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
  profileText: { marginLeft: theme.spacing.md, flex: 1 },
  name: theme.typography.subheading,
  meta: { ...theme.typography.bodyMuted, marginTop: 2 },
  action: { marginTop: theme.spacing.lg },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  reminderText: { flex: 1, paddingRight: theme.spacing.md },
  reminderTitle: theme.typography.subheading,
  reminderSub: { ...theme.typography.bodyMuted, marginTop: 2 },
  aboutCard: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  aboutTitle: theme.typography.subheading,
  aboutText: { ...theme.typography.bodyMuted, marginTop: theme.spacing.sm },
  version: { ...theme.typography.caption, marginTop: theme.spacing.md },
  danger: { marginTop: theme.spacing.xl, borderColor: theme.colors.danger },
});
