import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { currentUser, signOut, recipes, dishes } = useData();
  const [isLoading, setIsLoading] = useState(false);

  // Calcular estadísticas del usuario
  const userRecipes = recipes.filter(recipe => recipe.userId === currentUser?.id);
  const userDishes = dishes.filter(dish => dish.userId === currentUser?.id);
  const totalLikes = userRecipes.reduce((sum, recipe) => sum + recipe.likes, 0);

  const handleSignOut = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await signOut();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert(
                'Error',
                'No se pudo cerrar sesión. Por favor, inténtalo de nuevo.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            No hay usuario autenticado
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mi Perfil
        </Text>
      </View>

      <View style={styles.content}>
        {/* Avatar y información básica */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: colors.tint }]}>
            {currentUser.name ? (
              <Text style={[styles.avatarText, { color: colors.tint }]}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Text style={[styles.avatarText, { color: colors.tint }]}>U</Text>
            )}
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            {currentUser.name || 'Usuario'}
          </Text>
          
          <Text style={[styles.userEmail, { color: colors.icon }]}>
            {currentUser.email}
          </Text>
          
          <Text style={[styles.userBio, { color: colors.icon }]}>
            {currentUser.bio}
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={[styles.statsSection, { backgroundColor: colors.background, borderColor: colors.icon + '20' }]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Mis Estadísticas
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>
                {userDishes.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>
                Platillos
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>
                {userRecipes.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>
                Recetas
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>
                {totalLikes}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>
                Me gusta
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: colors.background, borderColor: '#ff4444' }]}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ff4444" />
          ) : (
            <Text style={[styles.signOutText, { color: '#ff4444' }]}>
              Cerrar Sesión
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  signOutButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 'auto',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});