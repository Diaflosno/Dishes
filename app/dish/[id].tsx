// app/dish/[id].tsx
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlusCircle } from "lucide-react-native";

import { useData } from "@/context/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import RecipeCard from "@/components/ui/recipe-card";
import { pickImageFromGallery, uploadImageAsync } from "@/firebase/uploadImage";

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dishes, recipes, currentUser, updateDish, deleteDish } = useData();
  const router = useRouter();

  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const dish = useMemo(() => dishes.find((d) => d.id === id), [dishes, id]);
  const dishRecipes = useMemo(() => recipes.filter((r) => r.dishId === id), [recipes, id]);

  const isOwner = currentUser && dish ? dish.userId === currentUser.id : false;

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(dish?.name || "");
  const [imageUrlDraft, setImageUrlDraft] = useState(dish?.imageId || "");

  if (!dish) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Platillo no encontrado</Text>
      </SafeAreaView>
    );
  }

  const handlePickImage = async () => {
    const uri = await pickImageFromGallery();
    if (!uri) return;
    try {
      const url = await uploadImageAsync(uri, `dishes/${dish.id}-${Date.now()}.jpg`);
      setImageUrlDraft(url);
      Alert.alert("✅ Imagen actualizada temporalmente", "Guarda los cambios para aplicar.");
    } catch {
      Alert.alert("Error", "No se pudo subir la imagen.");
    }
  };

  const handleSaveDish = async () => {
    try {
      await updateDish(dish.id, {
        name: nameDraft.trim() || dish.name,
        imageId: imageUrlDraft || dish.imageId,
      });
      Alert.alert("✅ Éxito", "Platillo actualizado.");
      setEditing(false);
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo actualizar el platillo.");
    }
  };

  const handleDeleteDish = () => {
    Alert.alert(
      "Eliminar platillo",
      "¿Estás seguro de que deseas eliminar este platillo? Se borrarán también sus recetas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDish(dish.id);
              Alert.alert("Eliminado", "El platillo se eliminó correctamente.");
              router.replace("/"); // volver a home
            } catch (e: any) {
              Alert.alert("Error", e.message || "No se pudo eliminar el platillo.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: dish.name }} />

      <FlatList
        data={dishRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Título + descripción */}
            <Text style={[styles.title, { color: colors.text }]}>{dish.name}</Text>
            {!!dish.description && (
              <Text style={[styles.description, { color: colors.icon }]}>
                {dish.description}
              </Text>
            )}

            {/* Acciones de propietario */}
            {isOwner && (
              <View style={styles.ownerRow}>
                {!editing ? (
                  <>
                    <TouchableOpacity style={[styles.btn, { borderColor: colors.tint }]} onPress={() => setEditing(true)}>
                      <Text style={[styles.btnTextOutline, { color: colors.tint }]}>Editar platillo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnDanger]} onPress={handleDeleteDish}>
                      <Text style={styles.btnDangerText}>Eliminar platillo</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ width: "100%" }}>
                    <Text style={[styles.editLabel, { color: colors.text }]}>Nombre</Text>
                    <TextInput
                      value={nameDraft}
                      onChangeText={setNameDraft}
                      style={[styles.input, { borderColor: colors.icon + "40", color: colors.text }]}
                      placeholder="Nombre del platillo"
                    />

                    <TouchableOpacity style={[styles.btn, { borderColor: colors.tint, marginTop: 10 }]} onPress={handlePickImage}>
                      <Text style={[styles.btnTextOutline, { color: colors.tint }]}>
                        Cambiar imagen (opcional)
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.editRow}>
                      <TouchableOpacity style={[styles.btnGhost]} onPress={() => setEditing(false)}>
                        <Text style={[styles.btnGhostText, { color: colors.icon }]}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btnSave, { backgroundColor: colors.tint }]} onPress={handleSaveDish}>
                        <Text style={styles.btnSaveText}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Encabezado de recetas + botón agregar */}
            <View style={styles.recipesHeader}>
              <Text style={[styles.recipesTitle, { color: colors.text }]}>Recetas</Text>
              <Link href={{ pathname: "/recipe/create", params: { dishId: dish.id } }} asChild>
                <TouchableOpacity style={styles.addBtn}>
                  <PlusCircle size={22} color={colors.tint} />
                  <Text style={[styles.addBtnText, { color: colors.tint }]}>Añadir receta</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              Aún no hay recetas para este platillo.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  description: { fontSize: 16, marginBottom: 16 },
  ownerRow: { gap: 10, marginBottom: 8 },
  btn: { paddingVertical: 10, borderWidth: 1, borderRadius: 10, alignItems: "center" },
  btnTextOutline: { fontSize: 16, fontWeight: "600" },
  btnDanger: { paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#ff4d4f" },
  btnDangerText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  editLabel: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16, backgroundColor: "#fff" },
  editRow: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 12 },
  btnGhost: { paddingVertical: 10, borderRadius: 10, alignItems: "center", flex: 1, backgroundColor: "#00000010" },
  btnGhostText: { fontSize: 16, fontWeight: "600" },
  btnSave: { paddingVertical: 10, borderRadius: 10, alignItems: "center", flex: 1 },
  btnSaveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  recipesHeader: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipesTitle: { fontSize: 22, fontWeight: "bold" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  addBtnText: { fontSize: 16, fontWeight: "600" },
  empty: { marginTop: 24, paddingBottom: 24, alignItems: "center" },
  emptyText: { fontSize: 16, textAlign: "center" },
});