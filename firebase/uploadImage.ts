// firebase/uploadImage.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import app from "./config";

const storage = getStorage(app);

// ✅ Subir imagen al Storage
export const uploadImageAsync = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    throw error;
  }
};

// ✅ (opcional) Selector de imagen — solo si quieres seguir importándolo
export const pickImageFromGallery = async (): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
};
