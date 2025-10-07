import RecipeCard from "@/components/ui/recipe-card";
import { Colors } from '@/constants/theme';
import { useData } from "@/context/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dish } from "@/lib/types";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { dishes, recipes } = useData();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [search, setSearch] = useState('');

  // 📦 Obtener los IDs de platillos que tienen recetas asociadas
  const dishIdsFromRecipes = recipes.map((recipe) => recipe.dishId);

  // 📋 Filtrar platillos que tengan recetas asociadas
  let filteredDishes = dishes.filter((dish) =>
    dishIdsFromRecipes.includes(dish.id)
  );

  // Filtrar por nombre si hay búsqueda
  if (search.trim() !== '') {
    filteredDishes = filteredDishes.filter(dish =>
      dish.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  // 🧁 Renderizar cada platillo
  const renderItem = ({ item }: { item: Dish }) => {
    const dishRecipes = recipes.filter((recipe) => recipe.dishId === item.id);

    return (
      <View style={styles.dishContainer}>
        <Text style={styles.dishTitle}>{item.name}</Text>
        <FlatList
          data={dishRecipes}
          horizontal
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(recipe) => recipe.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={styles.header}>Recetario</Text>

      {/* Input de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar platillo por nombre..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {/* ✅ Usamos los platillos filtrados */}
      <FlatList
        data={filteredDishes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 52, // margen superior igual que otras páginas
    backgroundColor: "#fff",
  },
  header: {
  fontSize: 38,
  fontWeight: "bold",
  marginBottom: 28,
  textAlign: 'center',
  color: '#fff',
  letterSpacing: 2,
  backgroundColor: '#000',
  borderRadius: 12,
  paddingHorizontal: 18,
  paddingVertical: 6,
  textShadowColor: '#000',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
  },
  dishContainer: {
    marginBottom: 24,
  },
  dishTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 18,
    color: '#222',
  },
});
