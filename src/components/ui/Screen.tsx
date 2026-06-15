import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';

type Props = {
  children: React.ReactNode;
  /** When true (default) content scrolls; set false for full-bleed layouts. */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Standard screen wrapper: safe-area aware, themed background, optional scroll
 * with consistent horizontal padding and generous bottom space for the tab bar.
 */
export function Screen({ children, scroll = true, contentStyle }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
});
