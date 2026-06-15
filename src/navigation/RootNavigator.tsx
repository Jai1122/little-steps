import React from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { theme } from '@/theme';
import { useProfile, useHydrated } from '@/store';
import { LoadingScreen } from '@/components/ui';
import OnboardingScreen from '@/screens/OnboardingScreen';
import MilestoneDetailScreen from '@/screens/MilestoneDetailScreen';
import ActivityDetailScreen from '@/screens/ActivityDetailScreen';
import ToyDetailScreen from '@/screens/ToyDetailScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: NavTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
  },
};

export function RootNavigator() {
  const hydrated = useHydrated();
  const { hasProfile } = useProfile();

  // Avoid flashing onboarding before persisted state has loaded.
  if (!hydrated) return <LoadingScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { color: theme.colors.text, fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        {!hasProfile ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="MilestoneDetail"
              component={MilestoneDetailScreen}
              options={{ title: 'Milestone' }}
            />
            <Stack.Screen
              name="ActivityDetail"
              component={ActivityDetailScreen}
              options={{ title: 'Activity' }}
            />
            <Stack.Screen
              name="ToyDetail"
              component={ToyDetailScreen}
              options={{ title: 'Toy' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Edit profile' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
