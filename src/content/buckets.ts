/**
 * Age math and age→bucket mapping. Pure functions, no React Native imports, so
 * this is trivially unit-testable. Day ranges are contiguous and cover all of
 * AGE_BUCKETS (asserted in buckets.test.ts).
 */
import { differenceInCalendarDays } from 'date-fns';
import { AgeBucket, AGE_BUCKETS } from './types';

export interface BucketRange {
  key: AgeBucket;
  /** Inclusive lower bound, in days since birth. */
  minDays: number;
  /** Exclusive upper bound, in days since birth (Infinity for the last bucket). */
  maxDays: number;
  /** Short human label, e.g. "4–6 weeks", "5 months". */
  label: string;
}

/**
 * Contiguous day ranges. Weeks for 0–13 weeks (0–90 days), then calendar-ish
 * months. The final bucket is open-ended (12 months and older).
 */
export const BUCKET_RANGES: readonly BucketRange[] = [
  { key: 'w0_1', minDays: 0, maxDays: 14, label: '0–1 weeks' },
  { key: 'w2_3', minDays: 14, maxDays: 28, label: '2–3 weeks' },
  { key: 'w4_6', minDays: 28, maxDays: 49, label: '4–6 weeks' },
  { key: 'w7_9', minDays: 49, maxDays: 70, label: '7–9 weeks' },
  { key: 'w10_13', minDays: 70, maxDays: 91, label: '10–13 weeks' },
  { key: 'm3', minDays: 91, maxDays: 122, label: '3 months' },
  { key: 'm4', minDays: 122, maxDays: 152, label: '4 months' },
  { key: 'm5', minDays: 152, maxDays: 183, label: '5 months' },
  { key: 'm6', minDays: 183, maxDays: 213, label: '6 months' },
  { key: 'm7', minDays: 213, maxDays: 244, label: '7 months' },
  { key: 'm8', minDays: 244, maxDays: 274, label: '8 months' },
  { key: 'm9', minDays: 274, maxDays: 305, label: '9 months' },
  { key: 'm10', minDays: 305, maxDays: 335, label: '10 months' },
  { key: 'm11', minDays: 335, maxDays: 366, label: '11 months' },
  { key: 'm12', minDays: 366, maxDays: Infinity, label: '12 months+' },
];

/** Fast lookup from bucket key to its range. */
const RANGE_BY_KEY: Record<AgeBucket, BucketRange> = BUCKET_RANGES.reduce(
  (acc, r) => {
    acc[r.key] = r;
    return acc;
  },
  {} as Record<AgeBucket, BucketRange>,
);

/** Whole days from birth date to `now` (calendar days, DST-safe). */
export function ageInDays(birthDate: Date, now: Date = new Date()): number {
  return differenceInCalendarDays(now, birthDate);
}

/** A birth date is valid if it is not in the future. */
export function isValidBirthDate(birthDate: Date, now: Date = new Date()): boolean {
  return ageInDays(birthDate, now) >= 0;
}

/**
 * Map an age in days to its bucket. Negative ages clamp to the first bucket
 * (callers should validate birth dates first); ages beyond 12 months pin to the
 * final `m12` bucket so older babies still see content.
 */
export function bucketForAge(days: number): AgeBucket {
  if (days < 0) return AGE_BUCKETS[0];
  const match = BUCKET_RANGES.find((r) => days >= r.minDays && days < r.maxDays);
  return (match ?? BUCKET_RANGES[BUCKET_RANGES.length - 1]).key;
}

/** Convenience: bucket directly from a birth date. */
export function bucketForBirthDate(birthDate: Date, now: Date = new Date()): AgeBucket {
  return bucketForAge(ageInDays(birthDate, now));
}

/** Short label for a bucket, e.g. "5 months". */
export function bucketLabel(bucket: AgeBucket): string {
  return RANGE_BY_KEY[bucket].label;
}

/** The range metadata for a bucket. */
export function bucketRange(bucket: AgeBucket): BucketRange {
  return RANGE_BY_KEY[bucket];
}

/**
 * Human-friendly description of a baby's current age for headers, e.g.
 * "Newborn", "3 weeks old", "5 months old". Weeks up to 13 weeks, then months.
 *
 * For the monthly range the month number is taken from the bucket so the
 * displayed age always agrees with the content stage being shown (avoids e.g.
 * "2 months old" while viewing the "3 months" bucket).
 */
export function describeAge(days: number): string {
  if (days < 0) return '—';
  if (days === 0) return 'Newborn';
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} old`;
  if (days < 91) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} old`;
  }
  const bucket = bucketForAge(days);
  const month = Number(bucket.slice(1)); // 'm5' -> 5
  if (isBeyondSupportedRange(days)) return `${month}+ months old`;
  return `${month} months old`;
}

/** True when the baby's age exceeds the supported 0–12 month content range. */
export function isBeyondSupportedRange(days: number): boolean {
  return days >= 366;
}
