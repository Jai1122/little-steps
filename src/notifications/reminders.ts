import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Local weekly reminders. No server/push involved — everything is scheduled
 * on-device.
 *
 * expo-notifications is **lazily required** inside guarded helpers and skipped
 * entirely in Expo Go. In Expo Go (SDK 53+) merely loading the module reports a
 * dev-mode error (push was removed), so we detect that runtime and no-op there.
 * Reminders work normally in a development or standalone build.
 */

type NotificationsModule = typeof import('expo-notifications');

const ANDROID_CHANNEL_ID = 'weekly-reminders';
// expo-notifications weekday: 1 = Sunday … 7 = Saturday.
const REMINDER_WEEKDAY = 2; // Monday
const REMINDER_HOUR = 10;

/** expo-notifications is unsupported in the Expo Go client. */
function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/** Returns the notifications module, or null if it can't be loaded/used here. */
function loadNotifications(): NotificationsModule | null {
  if (isExpoGo()) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-notifications') as NotificationsModule;
  } catch {
    return null;
  }
}

/** Call once at startup: foreground display behavior + Android channel. */
export async function configureNotifications(): Promise<void> {
  const N = loadNotifications();
  if (!N) return;
  try {
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Weekly reminders',
        importance: N.AndroidImportance.DEFAULT,
      });
    }
  } catch {
    // unavailable here; continue without notifications
  }
}

/** Request notification permission; returns whether it is granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const N = loadNotifications();
  if (!N) return false;
  try {
    const current = await N.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await N.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

/** Replace any existing reminder with a single weekly one. */
export async function scheduleWeeklyReminder(childName?: string): Promise<void> {
  const N = loadNotifications();
  if (!N) return;
  try {
    await N.cancelAllScheduledNotificationsAsync();
    await N.scheduleNotificationAsync({
      content: {
        title: 'LittleSteps',
        body: childName
          ? `See what's new for ${childName} this week 🌱`
          : "See what's new for your baby this week 🌱",
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.WEEKLY,
        weekday: REMINDER_WEEKDAY,
        hour: REMINDER_HOUR,
        minute: 0,
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
      },
    });
  } catch {
    // ignore
  }
}

/** Cancel all scheduled reminders. */
export async function cancelReminders(): Promise<void> {
  const N = loadNotifications();
  if (!N) return;
  try {
    await N.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
