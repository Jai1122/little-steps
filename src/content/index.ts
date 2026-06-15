/**
 * Public content API. Screens import from `@/content` only — never the raw JSON.
 * This keeps the data source swappable (local JSON today, a CMS/API later)
 * behind a stable set of query helpers.
 */
import milestonesData from './data/milestones.json';
import activitiesData from './data/activities.json';
import toysData from './data/toys.json';
import tipsData from './data/tips.json';
import {
  Activity,
  AgeBucket,
  CareTip,
  Domain,
  Milestone,
  Toy,
  DOMAINS,
} from './types';

// The JSON is validated for shape conformance in content.test.ts.
export const milestones: Milestone[] = milestonesData as Milestone[];
export const activities: Activity[] = activitiesData as Activity[];
export const toys: Toy[] = toysData as Toy[];
export const careTips: CareTip[] = tipsData as CareTip[];

// ----- Milestones -----

export function getMilestonesForBucket(bucket: AgeBucket): Milestone[] {
  return milestones.filter((m) => m.ageBucket === bucket);
}

/** Milestones for a bucket grouped by domain, in canonical domain order. */
export function getMilestonesByDomain(
  bucket: AgeBucket,
): { domain: Domain; items: Milestone[] }[] {
  const forBucket = getMilestonesForBucket(bucket);
  return DOMAINS.map((domain) => ({
    domain,
    items: forBucket.filter((m) => m.domain === domain),
  })).filter((group) => group.items.length > 0);
}

export function getMilestoneById(id: string): Milestone | undefined {
  return milestones.find((m) => m.id === id);
}

// ----- Activities -----

export function getActivitiesForBucket(bucket: AgeBucket): Activity[] {
  return activities.filter((a) => a.ageBuckets.includes(bucket));
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

// ----- Toys -----

export function getToysForBucket(bucket: AgeBucket): Toy[] {
  return toys.filter((t) => t.ageBuckets.includes(bucket));
}

export function getToyById(id: string): Toy | undefined {
  return toys.find((t) => t.id === id);
}

// ----- Care tips -----

export function getCareTipsForBucket(bucket: AgeBucket): CareTip[] {
  return careTips.filter((t) => t.ageBuckets.includes(bucket));
}

export function getCareTipById(id: string): CareTip | undefined {
  return careTips.find((t) => t.id === id);
}

// Re-export types and bucket helpers so consumers have a single entry point.
export * from './types';
export * from './buckets';
