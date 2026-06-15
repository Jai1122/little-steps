// Render children synchronously in tests (SafeAreaProvider otherwise waits for
// a layout pass that never happens in the test renderer).
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// In-memory AsyncStorage for the persistence layer under test.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
