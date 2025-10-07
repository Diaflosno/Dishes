import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { useData } from "@/context/DataContext";
import { useRouter } from "expo-router";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { toggleLike, currentUser } = useData();
  const router = useRouter();

  const isLiked = currentUser?.likedRecipeIds?.includes(recipe.id);

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`); // ✅ Navega al detalle correctamente
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* ✅ Mostrar imagen solo si existe */}
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      ) : null}

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