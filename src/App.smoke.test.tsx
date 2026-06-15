import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

/**
 * App-level smoke test: mounts the full provider + navigation tree and asserts
 * the onboarding screen renders after hydration (no profile yet). Catches
 * render-time errors that static typechecking and bundling cannot.
 */
describe('App (runtime smoke)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders the onboarding screen on first launch', async () => {
    const { getByText } = render(<App />);
    // LoadingScreen shows until persisted state hydrates, then onboarding.
    await waitFor(() => expect(getByText('Welcome to LittleSteps')).toBeTruthy());
    expect(getByText('Get started')).toBeTruthy();
  });
});
