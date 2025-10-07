import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Clock, Heart, Pencil } from "lucide-react-native";

import { useData } from "@/context/DataContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, toggleLike, currentUser } = useData();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const recipe = useMemo(() => recipes.find((r) => r.id === id), [recipes, id]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.notFound}>❌ Receta no encontrada</Text>
      </SafeAreaView>
    );
  }

  const isLiked = currentUser?.likedRecipeIds?.includes(recipe.id);
  const isOwner = currentUser?.id === recipe.userId; // ✅ Solo el creador puede editar

  const ingredientsList: string[] = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
    ? recipe.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const instructionsList: string[] = Array.isArray(recipe.steps)
    ? recipe.steps
    : typeof recipe.steps === "string"
    ? recipe.steps.split(".").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: recipe.title }} />
      <ScrollView>
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>

          <TouchableOpacity style={styles.likeButton} onPress={() => toggleLike(recipe.id)}>
            <Heart color={isLiked ? "red" : "gray"} fill={isLiked ? "red" : "none"} size={28} />
            <Text style={styles.likesCount}>{recipe.likes ?? 0}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.meta}>
          <Clock size={20} color={colors.text} />
          <Text style={styles.metaText}>{recipe.cookingTime} min</Text>
        </View>

        {/* ✅ Botón Editar (solo si el usuario es dueño) */}
        {isOwner && (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push(`/recipe/edit/${recipe.id}`)}
          >
            <Pencil color="#fff" size={20} />
            <Text style={styles.editText}>Editar Receta</Text>
          </TouchableOpacity>
        )}

        {/* 🍴 Ingredientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥬 Ingredientes</Text>
          {ingredientsList.map((ingredient, index) => (
            <Text key={index} style={styles.text}>
              • {ingredient}
            </Text>
          ))}
        </View>

        {/* 📖 Instrucciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Instrucciones</Text>
          {instructionsList.map((step, index) => (
            <Text key={index} style={styles.text}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, color: "gray" },
  image: { width: "100%", height: 250 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  likeButton: { flexDirection: "row", alignItems: "center" },
  likesCount: { fontSize: 20, marginLeft: 6, color: "#555" },
  meta: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 10 },
  metaText: { fontSize: 16, marginLeft: 8 },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 6 },
});
