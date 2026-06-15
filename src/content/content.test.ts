import {
  milestones,
  activities,
  toys,
  careTips,
  getMilestonesForBucket,
  getMilestonesByDomain,
  getActivitiesForBucket,
  getToysForBucket,
  getCareTipsForBucket,
  getMilestoneById,
  getActivityById,
  getToyById,
  getCareTipById,
} from './index';
import { AGE_BUCKETS, DOMAINS, isAgeBucket, isCareCategory, isDomain } from './types';

const nonEmptyString = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0;

describe('milestones dataset', () => {
  it('has unique ids', () => {
    const ids = milestones.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every record has a valid shape', () => {
    for (const m of milestones) {
      expect(nonEmptyString(m.id)).toBe(true);
      expect(isAgeBucket(m.ageBucket)).toBe(true);
      expect(isDomain(m.domain)).toBe(true);
      expect(nonEmptyString(m.title)).toBe(true);
      expect(nonEmptyString(m.description)).toBe(true);
      expect(nonEmptyString(m.typicalRange)).toBe(true);
      if (m.rangeNote !== undefined) expect(nonEmptyString(m.rangeNote)).toBe(true);
    }
  });
});

describe('activities dataset', () => {
  it('has unique ids', () => {
    const ids = activities.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every record has a valid shape', () => {
    for (const a of activities) {
      expect(nonEmptyString(a.id)).toBe(true);
      expect(a.ageBuckets.length).toBeGreaterThan(0);
      expect(a.ageBuckets.every(isAgeBucket)).toBe(true);
      expect(a.domains.length).toBeGreaterThan(0);
      expect(a.domains.every(isDomain)).toBe(true);
      expect(nonEmptyString(a.title)).toBe(true);
      expect(nonEmptyString(a.summary)).toBe(true);
      expect(a.steps.length).toBeGreaterThan(0);
      expect(a.steps.every(nonEmptyString)).toBe(true);
      expect(nonEmptyString(a.whyItHelps)).toBe(true);
      expect(nonEmptyString(a.image)).toBe(true);
      if (a.durationMin !== undefined) expect(a.durationMin).toBeGreaterThan(0);
    }
  });
});

describe('toys dataset', () => {
  it('has unique ids', () => {
    const ids = toys.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every record has a valid shape', () => {
    for (const t of toys) {
      expect(nonEmptyString(t.id)).toBe(true);
      expect(t.ageBuckets.length).toBeGreaterThan(0);
      expect(t.ageBuckets.every(isAgeBucket)).toBe(true);
      expect(t.domains.length).toBeGreaterThan(0);
      expect(t.domains.every(isDomain)).toBe(true);
      expect(nonEmptyString(t.title)).toBe(true);
      expect(nonEmptyString(t.description)).toBe(true);
      expect(nonEmptyString(t.benefit)).toBe(true);
      expect(nonEmptyString(t.image)).toBe(true);
    }
  });
});

describe('care tips dataset', () => {
  it('has unique ids', () => {
    const ids = careTips.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every record has a valid shape', () => {
    for (const t of careTips) {
      expect(nonEmptyString(t.id)).toBe(true);
      expect(t.ageBuckets.length).toBeGreaterThan(0);
      expect(t.ageBuckets.every(isAgeBucket)).toBe(true);
      expect(isCareCategory(t.category)).toBe(true);
      expect(nonEmptyString(t.title)).toBe(true);
      expect(nonEmptyString(t.body)).toBe(true);
    }
  });
});

describe('content coverage', () => {
  it('every age bucket has at least one milestone, activity, and toy', () => {
    for (const bucket of AGE_BUCKETS) {
      expect(getMilestonesForBucket(bucket).length).toBeGreaterThan(0);
      expect(getActivitiesForBucket(bucket).length).toBeGreaterThan(0);
      expect(getToysForBucket(bucket).length).toBeGreaterThan(0);
    }
  });

  it('every age bucket covers all four developmental domains in its milestones', () => {
    for (const bucket of AGE_BUCKETS) {
      const domainsPresent = new Set(getMilestonesForBucket(bucket).map((m) => m.domain));
      for (const domain of DOMAINS) {
        expect(domainsPresent.has(domain)).toBe(true);
      }
    }
  });
});

describe('content query helpers', () => {
  it('groups milestones by domain in canonical order', () => {
    const groups = getMilestonesByDomain('m6');
    expect(groups.length).toBeGreaterThan(0);
    const order = groups.map((g) => g.domain);
    const canonical = DOMAINS.filter((d) => order.includes(d));
    expect(order).toEqual(canonical);
  });

  it('looks up records by id', () => {
    expect(getMilestoneById(milestones[0].id)).toBe(milestones[0]);
    expect(getActivityById(activities[0].id)).toBe(activities[0]);
    expect(getToyById(toys[0].id)).toBe(toys[0]);
    expect(getCareTipById(careTips[0].id)).toBe(careTips[0]);
    expect(getMilestoneById('does-not-exist')).toBeUndefined();
  });

  it('returns care tips for a bucket', () => {
    expect(getCareTipsForBucket('m6').length).toBeGreaterThan(0);
  });
});
