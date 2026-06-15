import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

/** Bottom tab routes. */
export type TabParamList = {
  Home: undefined;
  Milestones: undefined;
  Activities: undefined;
  Toys: undefined;
  Settings: undefined;
};

/** Root stack: onboarding, the tab shell, and modal/detail screens. */
export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  MilestoneDetail: { milestoneId: string };
  ActivityDetail: { activityId: string };
  ToyDetail: { toyId: string };
  EditProfile: undefined;
};

/**
 * Navigation prop for a tab screen that also needs to reach root-stack routes
 * (e.g. detail screens) and sibling tabs. Use as
 * `useNavigation<TabScreenNavigation<'Home'>>()`.
 */
export type TabScreenNavigation<T extends keyof TabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, T>,
  NativeStackNavigationProp<RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
