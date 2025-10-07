import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useData } from "@/context/DataContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { pickImageFromGallery, uploadImageAsync } from "@/firebase/uploadImage";

export default function CreateRecipeScreen() {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const { addRecipe } = useData();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  // 🧠 Estados del formulario
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 📸 Elegir imagen
  const handlePickImage = async () => {
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  };

  const handleCreateRecipe = async () => {
    if (!title || !ingredients || !steps) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = "";

      // ☁️ Subir imagen si se eligió
      if (imageUri) {
        const fileName = `recipes/${Date.now()}.jpg`;
        imageUrl = await uploadImageAsync(imageUri, fileName);
      }

      const recipeData = {
        title,
        dishId: dishId ?? "",
        ingredients,
        steps,
        cookingTime: cookingTime ? Number(cookingTime) : undefined,
        imageUrl,
      };

      console.log("🍲 Guardando receta:", recipeData);
      await addRecipe(recipeData);

      Alert.alert("✅ Éxito", "Receta publicada con éxito");
      router.back();
    } catch (error) {
      console.error("❌ Error al publicar receta:", error);
      Alert.alert("Error", "No se pudo publicar la receta.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: "Crear Receta" }} />

      {/* 📸 Imagen */}
      <Text style={[styles.label, { color: colors.text }]}>📸 Imagen de la receta</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <Text style={{ color: colors.tint }}>Seleccionar imagen 📁</Text>
        )}
      </TouchableOpacity>

      {/* 🏷️ Título */}
      <Text style={[styles.label, { color: colors.text }]}>📛 Título</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: Pollo a la plancha"
      />

      {/* 🥬 Ingredientes */}
      <Text style={[styles.label, { color: colors.text }]}>
        🥦 Ingredientes (separados por coma)
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Ej: Pollo, aceite, sal"
      />

      {/* 📖 Instrucciones */}
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
        placeholder="Ej: Calienta el aceite. Cocina el pollo."
        multiline
      />

      {/* ⏱️ Tiempo de preparación */}
      <Text style={[styles.label, { color: colors.text }]}>
        ⏱️ Tiempo de preparación (minutos)
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
        value={cookingTime}
        onChangeText={setCookingTime}
        placeholder="Ej: 30"
        keyboardType="numeric"
      />

      {/* 📤 Botón */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={handleCreateRecipe}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Subiendo imagen..." : "✅ Publicar Receta"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  imagePicker: {
    height: 180,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
