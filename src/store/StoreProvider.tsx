import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AgeBucket,
  ageInDays as computeAgeInDays,
  bucketForBirthDate,
  describeAge,
  isBeyondSupportedRange,
} from '@/content';
import { Child, Settings } from './types';
import { PersistedState, defaultState, loadState, saveState } from './storage';

interface StoreContextValue {
  state: PersistedState;
  /** False until persisted state has been loaded from disk. */
  hydrated: boolean;
  saveChild: (input: { name: string; birthDate: string; photoUri?: string }) => void;
  clearAll: () => void;
  toggleMilestone: (milestoneId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function makeId(): string {
  return `child_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Single source of truth for app state, backed by AsyncStorage. Loads once on
 * mount (gating the UI via `hydrated`) and writes after every change.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once.
  useEffect(() => {
    let cancelled = false;
    loadState().then((loaded) => {
      if (!cancelled) {
        setState(loaded);
        setHydrated(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on change, but only after the initial load (never overwrite disk
  // with the default state before we've read it).
  const hydratedRef = useRef(false);
  hydratedRef.current = hydrated;
  useEffect(() => {
    if (hydratedRef.current) saveState(state);
  }, [state]);

  const saveChild = useCallback(
    (input: { name: string; birthDate: string; photoUri?: string }) => {
      setState((prev) => {
        const activeId = prev.activeChildId;
        const existing = prev.children.find((c) => c.id === activeId);
        if (existing) {
          const updated: Child = {
            ...existing,
            name: input.name.trim(),
            birthDate: input.birthDate,
            photoUri: input.photoUri,
          };
          return {
            ...prev,
            children: prev.children.map((c) => (c.id === existing.id ? updated : c)),
          };
        }
        const child: Child = {
          id: makeId(),
          name: input.name.trim(),
          birthDate: input.birthDate,
          photoUri: input.photoUri,
          createdAt: new Date().toISOString(),
        };
        return {
          ...prev,
          children: [...prev.children, child],
          activeChildId: child.id,
          settings: { ...prev.settings, hasOnboarded: true },
        };
      });
    },
    [],
  );

  const clearAll = useCallback(() => {
    // The persist effect writes the (empty) default state back to storage.
    setState(defaultState);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const toggleMilestone = useCallback((milestoneId: string) => {
    setState((prev) => {
      const childId = prev.activeChildId;
      if (!childId) return prev;
      const current = prev.progress[childId] ?? [];
      const next = current.includes(milestoneId)
        ? current.filter((id) => id !== milestoneId)
        : [...current, milestoneId];
      return { ...prev, progress: { ...prev.progress, [childId]: next } };
    });
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({ state, hydrated, saveChild, clearAll, toggleMilestone, updateSettings }),
    [state, hydrated, saveChild, clearAll, toggleMilestone, updateSettings],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('Store hooks must be used within a StoreProvider');
  return ctx;
}

/** True once persisted state has loaded; use to gate the first render. */
export function useHydrated(): boolean {
  return useStore().hydrated;
}

interface SettingsApi {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

export function useSettings(): SettingsApi {
  const { state, updateSettings } = useStore();
  return { settings: state.settings, updateSettings };
}

interface ProfileApi {
  child: Child | null;
  hasProfile: boolean;
  saveChild: StoreContextValue['saveChild'];
  clearChild: () => void;
  ageInDays: number | null;
  bucket: AgeBucket | null;
  ageLabel: string | null;
  beyondSupportedRange: boolean;
}

export function useProfile(): ProfileApi {
  const { state, saveChild, clearAll } = useStore();
  const child = state.children.find((c) => c.id === state.activeChildId) ?? null;

  return useMemo<ProfileApi>(() => {
    if (!child) {
      return {
        child: null,
        hasProfile: false,
        saveChild,
        clearChild: clearAll,
        ageInDays: null,
        bucket: null,
        ageLabel: null,
        beyondSupportedRange: false,
      };
    }
    const birth = new Date(child.birthDate);
    const days = computeAgeInDays(birth);
    return {
      child,
      hasProfile: true,
      saveChild,
      clearChild: clearAll,
      ageInDays: days,
      bucket: bucketForBirthDate(birth),
      ageLabel: describeAge(days),
      beyondSupportedRange: isBeyondSupportedRange(days),
    };
  }, [child, saveChild, clearAll]);
}

interface ProgressApi {
  isAchieved: (milestoneId: string) => boolean;
  toggle: (milestoneId: string) => void;
  achievedCount: (milestoneIds: string[]) => number;
}

export function useProgress(): ProgressApi {
  const { state, toggleMilestone } = useStore();
  const childId = state.activeChildId ?? null;
  const achievedForChild = childId ? state.progress[childId] ?? [] : [];

  const isAchieved = useCallback(
    (milestoneId: string) => achievedForChild.includes(milestoneId),
    [achievedForChild],
  );
  const achievedCount = useCallback(
    (milestoneIds: string[]) => {
      const set = new Set(achievedForChild);
      return milestoneIds.reduce((n, id) => (set.has(id) ? n + 1 : n), 0);
    },
    [achievedForChild],
  );

  return useMemo<ProgressApi>(
    () => ({ isAchieved, toggle: toggleMilestone, achievedCount }),
    [isAchieved, toggleMilestone, achievedCount],
  );
}
