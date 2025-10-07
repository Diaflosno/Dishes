import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { useData } from "@/context/DataContext";
import type { Recipe } from "@/lib/types";
import { useRouter } from "expo-router"; // 👈 Añade esto arriba

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { toggleLike, currentUser } = useData();
  const isLiked = currentUser?.likedRecipeIds?.includes(recipe.id);
  const router = useRouter(); // 👈 Inicializa el router

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/recipe/${recipe.id}`)} // 👈 Navega al detalle
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.likesRow}>
          <TouchableOpacity onPress={() => toggleLike(recipe.id)}>
            <Heart color={isLiked ? "red" : "gray"} fill={isLiked ? "red" : "none"} />
          </TouchableOpacity>
          <Text style={styles.likes}>{recipe.likes ?? 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  likesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  likes: {
    marginLeft: 6,
    fontSize: 16,
  },
});
