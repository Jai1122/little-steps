import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreProvider, useProfile, useProgress } from './index';
import { STORAGE_KEY } from './storage';

const MILESTONE = 'mst_m6_motor';

function Consumer() {
  const { hasProfile, ageLabel, saveChild, clearChild } = useProfile();
  const { isAchieved, toggle } = useProgress();
  return (
    <>
      <Text testID="hasProfile">{hasProfile ? 'has' : 'none'}</Text>
      <Text testID="age">{ageLabel ?? 'no-age'}</Text>
      <Text testID="achieved">{isAchieved(MILESTONE) ? 'achieved' : 'not'}</Text>
      <Pressable
        testID="save"
        onPress={() =>
          saveChild({ name: 'Maya', birthDate: new Date(2026, 0, 1).toISOString() })
        }
      >
        <Text>save</Text>
      </Pressable>
      <Pressable testID="toggle" onPress={() => toggle(MILESTONE)}>
        <Text>toggle</Text>
      </Pressable>
      <Pressable testID="clear" onPress={clearChild}>
        <Text>clear</Text>
      </Pressable>
    </>
  );
}

function renderConsumer() {
  return render(
    <StoreProvider>
      <Consumer />
    </StoreProvider>,
  );
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('store providers (runtime + persistence)', () => {
  it('starts with no profile after hydration', async () => {
    const { getByTestId } = renderConsumer();
    await waitFor(() => expect(getByTestId('hasProfile')).toHaveTextContent('none'));
    expect(getByTestId('age')).toHaveTextContent('no-age');
  });

  it('creates a profile, derives an age label, and persists it', async () => {
    const { getByTestId } = renderConsumer();
    await waitFor(() => expect(getByTestId('hasProfile')).toHaveTextContent('none'));
    fireEvent.press(getByTestId('save'));
    expect(getByTestId('hasProfile')).toHaveTextContent('has');
    expect(getByTestId('age')).toHaveTextContent(/\d+ months old/);
    // Written to storage.
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      expect(raw).toContain('Maya');
    });
  });

  it('rehydrates a saved profile into a fresh provider', async () => {
    const first = renderConsumer();
    await waitFor(() => expect(first.getByTestId('hasProfile')).toHaveTextContent('none'));
    fireEvent.press(first.getByTestId('save'));
    await waitFor(async () => {
      expect(await AsyncStorage.getItem(STORAGE_KEY)).toContain('Maya');
    });
    first.unmount();

    // A brand-new provider should load the saved profile from storage.
    const second = renderConsumer();
    await waitFor(() => expect(second.getByTestId('hasProfile')).toHaveTextContent('has'));
    expect(second.getByTestId('age')).toHaveTextContent(/\d+ months old/);
  });

  it('toggles milestone progress for the active child', async () => {
    const { getByTestId } = renderConsumer();
    await waitFor(() => expect(getByTestId('hasProfile')).toHaveTextContent('none'));
    fireEvent.press(getByTestId('save'));
    expect(getByTestId('achieved')).toHaveTextContent('not');
    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('achieved')).toHaveTextContent('achieved');
    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('achieved')).toHaveTextContent('not');
  });

  it('clears everything on reset', async () => {
    const { getByTestId } = renderConsumer();
    await waitFor(() => expect(getByTestId('hasProfile')).toHaveTextContent('none'));
    fireEvent.press(getByTestId('save'));
    expect(getByTestId('hasProfile')).toHaveTextContent('has');
    fireEvent.press(getByTestId('clear'));
    expect(getByTestId('hasProfile')).toHaveTextContent('none');
    // Storage is reset to the empty default (no child data remains).
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      expect(raw).not.toContain('Maya');
      expect(JSON.parse(raw ?? '{}').children).toEqual([]);
    });
  });

  it('ignores progress toggles when there is no profile', async () => {
    const { getByTestId } = renderConsumer();
    await waitFor(() => expect(getByTestId('hasProfile')).toHaveTextContent('none'));
    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('achieved')).toHaveTextContent('not');
  });
});
