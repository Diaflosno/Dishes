import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useData } from "@/context/DataContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { pickImageFromGallery, uploadImageAsync } from "@/firebase/uploadImage";
import type { Recipe } from "@/lib/types";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, updateRecipe } = useData();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  // 📌 Buscar la receta original
  const recipe = recipes.find((r) => r.id === id);

  // 🧠 Estados con valores iniciales precargados
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [ingredients, setIngredients] = useState(
    Array.isArray(recipe?.ingredients)
      ? recipe?.ingredients.join(", ")
      : recipe?.ingredients ?? ""
  );
  const [steps, setSteps] = useState(
    Array.isArray(recipe?.steps)
      ? recipe?.steps.join(". ")
      : recipe?.steps ?? ""
  );
  const [cookingTime, setCookingTime] = useState(
    recipe?.cookingTime ? String(recipe.cookingTime) : ""
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(recipe?.imageUrl);
  const [saving, setSaving] = useState(false);

  // 📷 Cambiar imagen
  const handleImageChange = async () => {
    const uri = await pickImageFromGallery();
    if (uri) {
      try {
        const url = await uploadImageAsync(uri, `recipes/${id}-${Date.now()}.jpg`);
        setImageUrl(url);
      } catch (error) {
        console.error("❌ Error al subir imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    }
  };

  // 💾 Guardar cambios
  const handleSave = async () => {
    if (!title || !ingredients || !steps) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    setSaving(true);
    try {
      const updatedRecipe: Recipe = {
        id: recipe?.id ?? "",
        dishId: recipe?.dishId ?? "",
        userId: recipe?.userId ?? "",
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        steps,
        cookingTime: cookingTime ? Number(cookingTime) : undefined,
        imageUrl: imageUrl ?? "",
        likes: recipe?.likes ?? 0,
      };

      await updateRecipe(updatedRecipe);
      Alert.alert("✅ Éxito", "La receta se actualizó correctamente.");
      router.push(`/recipe/${id}`);
    } catch (error) {
      console.error("❌ Error al actualizar la receta:", error);
      Alert.alert("Error", "No se pudo actualizar la receta.");
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>❌ Receta no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ Cambiar el título de la pantalla */}
      <Stack.Screen options={{ title: `✏️ Editar: ${title || "Receta"}` }} />

      <Text style={[styles.label, { color: colors.text }]}>📛 Título</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: colors.text }]}>
        🥦 Ingredientes (separados por coma)
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={ingredients}
        onChangeText={setIngredients}
      />

      <Text style={[styles.label, { color: colors.text }]}>
        📜 Instrucciones (separadas por punto)
      </Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.tint, height: 100 },
        ]}
        value={steps}
        onChangeText={setSteps}
        multiline
      />

      <Text style={[styles.label, { color: colors.text }]}>
        ⏱️ Tiempo de preparación (minutos)
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={cookingTime}
        onChangeText={setCookingTime}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: colors.tint }]}
        onPress={handleImageChange}
      >
        <Text style={styles.buttonText}>📷 Cambiar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Guardando..." : "💾 Guardar cambios"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 5 },
  button: { marginTop: 30, padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  imageButton: { marginTop: 20, padding: 15, borderRadius: 10, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, color: "gray" },
});