import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useData } from "@/context/DataContext";
import { Dish } from "@/lib/types";
import RecipeCard from "@/components/ui/recipe-card";

export default function HomeScreen() {
  const { dishes, recipes } = useData();

  // 📦 Obtener los IDs de platillos que tienen recetas asociadas
  const dishIdsFromRecipes = recipes.map((recipe) => recipe.dishId);

  // 📋 Filtrar platillos que tengan recetas asociadas
  const filteredDishes = dishes.filter((dish) =>
    dishIdsFromRecipes.includes(dish.id)
  );

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
    <View style={styles.container}>
      <Text style={styles.header}>📖 Recetario</Text>

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
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  dishContainer: {
    marginBottom: 24,
  },
  dishTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
});
