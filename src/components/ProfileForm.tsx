import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { theme, MIN_TAP } from '@/theme';
import { isValidBirthDate } from '@/content';
import { PrimaryButton } from '@/components/ui';

export type ProfileFormValues = {
  name: string;
  birthDate: string; // ISO
  photoUri?: string;
};

type Props = {
  initial?: Partial<ProfileFormValues>;
  submitLabel: string;
  onSubmit: (values: ProfileFormValues) => void;
};

/** Shared profile form for onboarding and editing. Validates name + birth date. */
export function ProfileForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    initial?.birthDate ? new Date(initial.birthDate) : null,
  );
  const [photoUri, setPhotoUri] = useState<string | undefined>(initial?.photoUri);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValueChange = (_event: unknown, selected: Date) => {
    // Android shows a modal dialog; close it once a value is chosen.
    if (Platform.OS === 'android') setShowPicker(false);
    setBirthDate(selected);
    setError(null);
  };

  const pickPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo access to add a picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Could not add photo', 'Please try again.');
    }
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your baby's name.");
      return;
    }
    if (!birthDate) {
      setError("Please choose your baby's birth date.");
      return;
    }
    if (!isValidBirthDate(birthDate)) {
      setError('Birth date cannot be in the future.');
      return;
    }
    onSubmit({ name: trimmed, birthDate: birthDate.toISOString(), photoUri });
  };

  return (
    <View>
      <Pressable style={styles.photoWrap} onPress={pickPhoto} accessibilityRole="button" accessibilityLabel="Add a profile photo">
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={26} color={theme.colors.primary} />
            <Text style={styles.photoHint}>Add photo</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.label}>Baby's name</Text>
      <TextInput
        value={name}
        onChangeText={(t) => {
          setName(t);
          if (error) setError(null);
        }}
        placeholder="e.g. Maya"
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        accessibilityLabel="Baby's name"
        returnKeyType="done"
        maxLength={40}
      />

      <Text style={styles.label}>Birth date</Text>
      <Pressable
        style={styles.input}
        onPress={() => setShowPicker(true)}
        accessibilityRole="button"
        accessibilityLabel={
          birthDate ? `Birth date ${format(birthDate, 'MMMM d, yyyy')}` : 'Choose birth date'
        }
      >
        <Text style={birthDate ? styles.inputText : styles.inputPlaceholder}>
          {birthDate ? format(birthDate, 'MMMM d, yyyy') : 'Choose a date'}
        </Text>
      </Pressable>

      {showPicker ? (
        <DateTimePicker
          value={birthDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onValueChange={handleValueChange}
          onDismiss={() => setShowPicker(false)}
        />
      ) : null}
      {Platform.OS === 'ios' && showPicker ? (
        <PrimaryButton
          label="Done"
          variant="secondary"
          onPress={() => setShowPicker(false)}
          style={styles.doneBtn}
        />
      ) : null}

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <PrimaryButton label={submitLabel} onPress={handleSubmit} style={styles.submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  photoWrap: { alignSelf: 'center', marginBottom: theme.spacing.lg },
  photo: { width: 96, height: 96, borderRadius: theme.radius.pill },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: { ...theme.typography.caption, color: theme.colors.primary, marginTop: 2 },
  label: { ...theme.typography.label, marginBottom: theme.spacing.xs, marginTop: theme.spacing.md },
  input: {
    minHeight: MIN_TAP,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    ...theme.typography.body,
  },
  inputText: theme.typography.body,
  inputPlaceholder: { ...theme.typography.body, color: theme.colors.textMuted },
  doneBtn: { marginTop: theme.spacing.sm },
  error: { ...theme.typography.caption, color: theme.colors.danger, marginTop: theme.spacing.md },
  submit: { marginTop: theme.spacing.xl },
});
