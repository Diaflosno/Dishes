import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SearchProvider } from '@/context/SearchContext';
import { DataProvider, useData } from '@/context/DataContext';
import LoginScreen from './login';

function AppNavigator() {
  const { isAuthenticated, isDataLoaded } = useData();

  // Mostrar loading mientras se verifica la autenticación
  if (!isDataLoaded) {
    return null; // Podrías mostrar un splash screen aquí
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Si está autenticado, mostrar la app principal
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DataProvider>
        <SearchProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SearchProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
