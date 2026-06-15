/**
 * Local app-state shapes. Kept in one place so the Stage 3 persistence layer
 * can serialize/deserialize exactly these types. The structure already allows
 * multiple children (a future feature) even though the UI manages one today.
 */

export interface Child {
  id: string;
  name: string;
  /** ISO date string (date only, no time component needed). */
  birthDate: string;
  /** Optional local URI to a profile photo. */
  photoUri?: string;
  createdAt: string;
}

export interface Settings {
  remindersEnabled: boolean;
  /** 0 (Sun) – 6 (Sat); the weekday a weekly reminder fires. */
  reminderWeekday?: number;
  hasOnboarded: boolean;
}

/** Achieved milestone ids, keyed by child id. */
export type ProgressMap = Record<string, string[]>;

/** Bumped when the persisted shape changes, to support migrations later. */
export const SCHEMA_VERSION = 1;
