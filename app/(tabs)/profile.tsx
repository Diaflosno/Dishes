import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useData } from '@/context/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import RecipeCard from '@/components/ui/recipe-card';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { currentUser, dishes, recipes, signOut } = useData();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  // 🍲 Platillos y recetas creadas por el usuario
  const userDishes = dishes.filter(d => d.userId === currentUser.id);
  const userRecipes = recipes.filter(r => r.userId === currentUser.id);

  // ❤️ Recetas que el usuario ha dado "me gusta"
  const likedRecipes = useMemo(() => {
    return recipes.filter(r => (currentUser?.likedRecipeIds || []).includes(r.id));
  }, [recipes, currentUser?.likedRecipeIds]);

  // 📊 Estadísticas
  const totalLikesReceived = useMemo(() => {
    return userRecipes.reduce((sum, r) => sum + (r.likes || 0), 0);
  }, [userRecipes]);

  const totalLikesGiven = currentUser.likedRecipeIds?.length || 0;

  // 🔐 Cerrar sesión
  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 👤 Información básica del usuario */}
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{currentUser.name}</Text>
        <Text style={[styles.email, { color: colors.icon }]}>{currentUser.email}</Text>
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: colors.tint,
            paddingVertical: 7,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            minWidth: 120,
          }}
          onPress={signOut}
        >
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Estadísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>{userDishes.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Platillos</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>{userRecipes.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Recetas</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>{totalLikesGiven}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Me gusta dados</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>{totalLikesReceived}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Me gusta recibidos</Text>
        </View>
      </View>

      {/* 🔐 Botón de cerrar sesión */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.tint }]} onPress={handleSignOut}>
        <Text style={styles.logoutText}>🔓 Cerrar sesión</Text>
      </TouchableOpacity>

      {/* ❤️ Recetas que ha dado like */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recetas que te han gustado
        </Text>

        {likedRecipes.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>
            Aún no has dado &quot;me gusta&quot; a ninguna receta 🍽️
          </Text>
        ) : (
          likedRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 72, // margen superior aún mayor
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});
