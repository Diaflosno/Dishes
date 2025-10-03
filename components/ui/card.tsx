import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: colors.background,
        shadowColor: colors.text,
        borderColor: colors.icon,
      },
      style
    ]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  return (
    <View style={[styles.title, style]}>
      {children}
    </View>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return (
    <View style={[styles.description, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  header: {
    padding: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    // Este contenedor solo organiza, el texto debe tener su propio estilo
  },
  description: {
    marginTop: 8,
  },
});