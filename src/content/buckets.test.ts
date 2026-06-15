import { AGE_BUCKETS } from './types';
import {
  ageInDays,
  isValidBirthDate,
  bucketForAge,
  bucketForBirthDate,
  bucketLabel,
  describeAge,
  isBeyondSupportedRange,
  BUCKET_RANGES,
} from './buckets';

describe('BUCKET_RANGES integrity', () => {
  it('lists exactly the AGE_BUCKETS in the same order', () => {
    expect(BUCKET_RANGES.map((r) => r.key)).toEqual([...AGE_BUCKETS]);
  });

  it('is contiguous starting at day 0 and ending open-ended', () => {
    expect(BUCKET_RANGES[0].minDays).toBe(0);
    for (let i = 1; i < BUCKET_RANGES.length; i++) {
      expect(BUCKET_RANGES[i].minDays).toBe(BUCKET_RANGES[i - 1].maxDays);
    }
    expect(BUCKET_RANGES[BUCKET_RANGES.length - 1].maxDays).toBe(Infinity);
  });

  it('has a non-empty label for every bucket', () => {
    for (const r of BUCKET_RANGES) {
      expect(r.label.length).toBeGreaterThan(0);
    }
  });
});

describe('ageInDays', () => {
  it('counts whole calendar days between dates', () => {
    const birth = new Date(2026, 0, 1);
    expect(ageInDays(birth, new Date(2026, 0, 1))).toBe(0);
    expect(ageInDays(birth, new Date(2026, 0, 8))).toBe(7);
    expect(ageInDays(birth, new Date(2026, 1, 1))).toBe(31);
  });
});

describe('isValidBirthDate', () => {
  const now = new Date(2026, 5, 14);
  it('accepts today and past dates', () => {
    expect(isValidBirthDate(now, now)).toBe(true);
    expect(isValidBirthDate(new Date(2026, 0, 1), now)).toBe(true);
  });
  it('rejects future dates', () => {
    expect(isValidBirthDate(new Date(2026, 5, 15), now)).toBe(false);
  });
});

describe('bucketForAge boundaries', () => {
  const cases: [number, string][] = [
    [0, 'w0_1'],
    [13, 'w0_1'],
    [14, 'w2_3'],
    [27, 'w2_3'],
    [28, 'w4_6'],
    [48, 'w4_6'],
    [49, 'w7_9'],
    [69, 'w7_9'],
    [70, 'w10_13'],
    [90, 'w10_13'],
    [91, 'm3'],
    [121, 'm3'],
    [122, 'm4'],
    [365, 'm11'],
    [366, 'm12'],
    [1000, 'm12'],
  ];
  it.each(cases)('day %i -> %s', (days, expected) => {
    expect(bucketForAge(days)).toBe(expected);
  });

  it('clamps negative ages to the first bucket', () => {
    expect(bucketForAge(-5)).toBe('w0_1');
  });
});

describe('bucketForBirthDate', () => {
  it('maps a birth date to the right bucket', () => {
    const now = new Date(2026, 5, 14);
    // Born 2026-01-14, "now" 2026-06-14 = 151 days -> m4 ([122,152))
    expect(bucketForBirthDate(new Date(2026, 0, 14), now)).toBe('m4');
  });
});

describe('describeAge', () => {
  it('describes early ages in days then weeks', () => {
    expect(describeAge(0)).toBe('Newborn');
    expect(describeAge(1)).toBe('1 day old');
    expect(describeAge(3)).toBe('3 days old');
    expect(describeAge(7)).toBe('1 week old');
    expect(describeAge(21)).toBe('3 weeks old');
    expect(describeAge(90)).toBe('12 weeks old');
  });

  it('describes months consistently with the bucket', () => {
    expect(describeAge(91)).toBe('3 months old');
    expect(describeAge(121)).toBe('3 months old');
    expect(describeAge(122)).toBe('4 months old');
    expect(describeAge(200)).toBe('6 months old');
  });

  it('marks ages beyond the supported range with a plus', () => {
    expect(describeAge(400)).toBe('12+ months old');
  });
});

describe('isBeyondSupportedRange', () => {
  it('is true only at 12 months and older', () => {
    expect(isBeyondSupportedRange(365)).toBe(false);
    expect(isBeyondSupportedRange(366)).toBe(true);
  });
});

describe('bucketLabel', () => {
  it('returns the human label', () => {
    expect(bucketLabel('m5')).toBe('5 months');
    expect(bucketLabel('w4_6')).toBe('4–6 weeks');
    expect(bucketLabel('m12')).toBe('12 months+');
  });
});
