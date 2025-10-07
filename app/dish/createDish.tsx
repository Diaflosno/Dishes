import React, { useState } from "react";
import { Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { useData } from "@/context/DataContext";
import { pickImageFromGallery, uploadImageAsync } from "@/firebase/uploadImage";

export default function CreateDishScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { currentUser } = useData();

  const handlePickImage = async () => {
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  };

  const handleCreateDish = async () => {
    if (!currentUser) return Alert.alert("Error", "Debes iniciar sesión primero.");
    if (!name) return Alert.alert("Error", "El nombre es obligatorio.");

    let imageUrl = "";
    if (imageUri) {
      imageUrl = await uploadImageAsync(
        imageUri,
        `dishes/${currentUser.id}_${Date.now()}.jpg`
      );
    }

    await addDoc(collection(firestore, "dishes"), {
      name,
      description,
      userId: currentUser.id,
      imageUrl,
    });

    Alert.alert("✅ Platillo creado", "Tu platillo se ha guardado correctamente.");
    setName("");
    setDescription("");
    setImageUri(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nuevo platillo 🍲</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del platillo"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Seleccionar imagen desde galería" onPress={handlePickImage} />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <Button title="Crear Platillo" onPress={handleCreateDish} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  preview: { width: "100%", height: 200, marginVertical: 16, borderRadius: 10 },
});
