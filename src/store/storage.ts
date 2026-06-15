import AsyncStorage from '@react-native-async-storage/async-storage';
import { Child, ProgressMap, Settings, SCHEMA_VERSION } from './types';

/** The full persisted app state (one JSON blob under one key). */
export interface PersistedState {
  schemaVersion: number;
  children: Child[];
  activeChildId?: string;
  progress: ProgressMap;
  settings: Settings;
}

export const STORAGE_KEY = '@littlesteps/state/v1';

export const defaultState: PersistedState = {
  schemaVersion: SCHEMA_VERSION,
  children: [],
  activeChildId: undefined,
  progress: {},
  settings: { remindersEnabled: false, hasOnboarded: false },
};

/**
 * Merge a loaded state with defaults so missing keys (from older versions or
 * partial writes) never crash the app. Extend here when SCHEMA_VERSION bumps.
 */
function migrate(state: Partial<PersistedState>): PersistedState {
  return {
    ...defaultState,
    ...state,
    settings: { ...defaultState.settings, ...state.settings },
  };
}

export async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return migrate(JSON.parse(raw) as Partial<PersistedState>);
  } catch {
    // Corrupt or unreadable storage: fall back to a clean slate.
    return defaultState;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort write; a failed save shouldn't crash the UI.
  }
}
