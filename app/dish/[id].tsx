import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusCircle } from 'lucide-react-native';

import { useData } from '@/context/DataContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import RecipeCard from '@/components/ui/recipe-card';


export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dishes, recipes } = useData();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const dish = useMemo(() => dishes.find(d => d.id === id), [dishes, id]);
  
  const dishRecipes = useMemo(() => recipes.filter(r => r.dishId === id), [recipes, id]);

  if (!dish) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Platillo no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: dish.name }} />
      
      <FlatList
        data={dishRecipes}
        renderItem={({ item }) => item ? <RecipeCard recipe={item} /> : null}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{dish.name}</Text>
            <Text style={[styles.description, { color: colors.icon }]}>{dish.description}</Text>
            <View style={styles.recipesHeader}>
              <Text style={[styles.recipesTitle, { color: colors.text }]}>Recetas</Text>
              <Link href={{ pathname: '/recipe/create', params: { dishId: dish.id } }} asChild>
                <TouchableOpacity style={styles.addButton}>
                  <PlusCircle size={24} color={colors.tint} />
                  <Text style={[styles.addButtonText, { color: colors.tint }]}>Añadir Receta</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              Aún no hay recetas para este platillo. ¡Sé el primero en añadir una!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listContentContainer: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  recipesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12,
  },
  recipesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});