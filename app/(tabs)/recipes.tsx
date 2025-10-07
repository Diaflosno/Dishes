import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { recipes, currentUser } = useData();

  // Filtrar recetas creadas por el usuario autenticado
  const userRecipes = currentUser ? recipes.filter(r => r.userId === currentUser.id) : [];

  const router = useRouter();

  // Renderizar cada receta con diseño similar a platillos
  const renderRecipe = ({ item }: any) => {
    const imageUrl = item.imageUrl?.startsWith('http')
      ? item.imageUrl
      : `https://picsum.photos/seed/${item.id}/400/250`;

    return (
      <TouchableOpacity
        style={styles.dishCard}
        onPress={() => router.push(`/recipe/${item.id}`)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.dishImage}
          contentFit="cover"
        />
        <View style={styles.dishInfo}>
          <Text style={[styles.dishName, { color: '#fff', fontSize: 22, fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={[styles.dishDescription, { color: colors.icon }]}
            numberOfLines={2}
          >
            {item.cookingTime ? `⏱️ ${item.cookingTime} min` : 'Sin tiempo'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Mis Recetas</Text>
        <Text style={{ color: colors.icon }}>
          Aquí podrás ver tus recetas que has creado.
        </Text>
      </View>
      <FlatList
        data={userRecipes}
        keyExtractor={item => item.id}
        renderItem={renderRecipe}
        ListEmptyComponent={<Text style={{ color: colors.icon, textAlign: 'center', marginTop: 40 }}>No has creado recetas aún.</Text>}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 52,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dishCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dishImage: {
    width: '100%',
    height: 180,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
  },
});