import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

export function Button({ 
  children, 
  onPress, 
  style, 
  variant = 'default',
  disabled = false 
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    switch (variant) {
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderColor: colors.tint,
            borderWidth: 1,
          }
        ];
      case 'ghost':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
          }
        ];
      default:
        return [
          ...baseStyle,
          {
            backgroundColor: colors.tint,
          }
        ];
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});