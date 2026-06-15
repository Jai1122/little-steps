import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui';
import { ProfileForm } from '@/components/ProfileForm';
import { useProfile } from '@/store';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { child, saveChild } = useProfile();

  return (
    <Screen>
      <ProfileForm
        initial={child ?? undefined}
        submitLabel="Save changes"
        onSubmit={(values) => {
          saveChild(values);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}
