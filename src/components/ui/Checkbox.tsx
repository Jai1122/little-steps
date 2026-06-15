import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, MIN_TAP } from '@/theme';

type Props = {
  checked: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
};

/**
 * Round checkbox. State is conveyed by both the check icon and fill (not color
 * alone) and exposed to screen readers via the `checkbox` role + checked state.
 */
export function Checkbox({ checked, onToggle, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.box, checked ? styles.boxChecked : styles.boxUnchecked]}
    >
      {checked ? <Ionicons name="checkmark" size={20} color={theme.colors.textInverse} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: MIN_TAP,
    height: MIN_TAP,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxUnchecked: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  boxChecked: {
    backgroundColor: theme.colors.success,
  },
});
