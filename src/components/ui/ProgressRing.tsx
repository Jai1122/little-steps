import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '@/theme';

type Props = {
  achieved: number;
  total: number;
  size?: number;
  strokeWidth?: number;
};

/**
 * Circular progress indicator showing achieved / total milestones. The numeric
 * label inside makes the value available without relying on the arc alone.
 */
export function ProgressRing({ achieved, total, size = 96, strokeWidth = 10 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(achieved / total, 1) : 0;
  const dashOffset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={`${achieved} of ${total} milestones tracked`}
      accessibilityValue={{ min: 0, max: total, now: achieved }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={styles.count}>{achieved}</Text>
        <Text style={styles.total}>of {total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 24, fontWeight: '800', color: theme.colors.text, lineHeight: 26 },
  total: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },
});
