import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { currentUser, logout } = useData();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
      
      {currentUser ? (
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {currentUser.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.icon }]}>
            {currentUser.email}
          </Text>
          <Text style={[styles.userBio, { color: colors.icon }]}>
            {currentUser.bio}
          </Text>
          
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.tint }]}
            onPress={logout}
          >
            <Text style={[styles.logoutText, { color: '#fff' }]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          No hay usuario logueado
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});