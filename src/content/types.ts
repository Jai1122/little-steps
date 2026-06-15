/**
 * Canonical content types for LittleSteps. This module is the single source of
 * truth for developmental domains and age buckets; the theme and UI import
 * these types so everything stays in sync.
 *
 * Content is intentionally decoupled from binary assets: the `image` field is a
 * string *key*, resolved to a bundled illustration (or placeholder) in the UI
 * layer. Swapping artwork later never touches the data.
 */

/** Developmental domains. Order here is the canonical display order. */
export const DOMAINS = ['motor', 'cognitive', 'social', 'language'] as const;
export type Domain = (typeof DOMAINS)[number];

export const DOMAIN_LABELS: Record<Domain, string> = {
  motor: 'Motor skills',
  cognitive: 'Cognitive',
  social: 'Social & emotional',
  language: 'Language',
};

/**
 * Age buckets covering 0–12 months. Weeks for the fast-changing newborn period,
 * then months. Order here is chronological and is asserted against the bucket
 * day-ranges in tests.
 */
export const AGE_BUCKETS = [
  'w0_1',
  'w2_3',
  'w4_6',
  'w7_9',
  'w10_13',
  'm3',
  'm4',
  'm5',
  'm6',
  'm7',
  'm8',
  'm9',
  'm10',
  'm11',
  'm12',
] as const;
export type AgeBucket = (typeof AGE_BUCKETS)[number];

/** A single developmental milestone, anchored to one bucket and one domain. */
export interface Milestone {
  id: string;
  ageBucket: AgeBucket;
  domain: Domain;
  title: string;
  description: string;
  /**
   * Compact normal-range window for prominent display, e.g. "6 weeks – 4 months".
   * Anchored to Indian norms (IAP / Trivandrum Developmental Screening Chart),
   * cross-checked with WHO windows of achievement. Present on every milestone.
   */
  typicalRange: string;
  /** Reassuring range framing, e.g. "Many babies do this between 3–5 months." */
  rangeNote?: string;
}

/** A suggested play activity. Can apply to several buckets/domains. */
export interface Activity {
  id: string;
  ageBuckets: AgeBucket[];
  domains: Domain[];
  title: string;
  summary: string;
  steps: string[];
  whyItHelps: string;
  /** Asset key resolved to an image in the UI layer. */
  image: string;
  durationMin?: number;
}

/** A toy recommendation tied to age + developmental areas. */
export interface Toy {
  id: string;
  ageBuckets: AgeBucket[];
  domains: Domain[];
  title: string;
  description: string;
  /** What this toy helps develop. */
  benefit: string;
  /** Asset key resolved to an image in the UI layer. */
  image: string;
}

/** Categories for stage-based care tips (feeding, daily care, culture, safety). */
export const CARE_CATEGORIES = ['feeding', 'care', 'culture', 'safety'] as const;
export type CareCategory = (typeof CARE_CATEGORIES)[number];

export const CARE_CATEGORY_LABELS: Record<CareCategory, string> = {
  feeding: 'Feeding',
  care: 'Daily care',
  culture: 'Tradition',
  safety: 'Safety',
};

/**
 * A gentle, stage-based care/feeding/cultural note. Distinct from play
 * activities — surfaced as informational cards, framed as general guidance
 * (not medical advice). Tailored to Indian family routines and foods.
 */
export interface CareTip {
  id: string;
  ageBuckets: AgeBucket[];
  category: CareCategory;
  title: string;
  body: string;
}

/** Type guards used by the content-integrity test and any runtime validation. */
export function isDomain(value: unknown): value is Domain {
  return typeof value === 'string' && (DOMAINS as readonly string[]).includes(value);
}

export function isAgeBucket(value: unknown): value is AgeBucket {
  return typeof value === 'string' && (AGE_BUCKETS as readonly string[]).includes(value);
}

export function isCareCategory(value: unknown): value is CareCategory {
  return typeof value === 'string' && (CARE_CATEGORIES as readonly string[]).includes(value);
}
