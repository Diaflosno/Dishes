import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface InputProps extends TextInputProps {
  style?: any;
}

export function Input({ style, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.background,
          borderColor: colors.icon,
          color: colors.text,
        },
        style
      ]}
      placeholderTextColor={colors.icon}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});