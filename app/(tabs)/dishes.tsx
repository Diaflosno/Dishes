import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { pickImageFromGallery, uploadImageAsync } from '@/firebase/uploadImage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Image as RNImage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DishesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { addDish, dishes, currentUser } = useData();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 📸 NUEVO: Estado para imagen
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCrearPlatillo = () => {
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
    setError('');
    if (!name.trim() || !description.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImageAsync(imageUri, `dishes/${Date.now()}.jpg`);
      }

      await addDish({ name, description }, imageUrl);
      setModalVisible(false);
      setName('');
      setDescription('');
      setImageUri(null);
    } catch (e) {
      console.error(e);
      setError('Error al crear el platillo.');
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Renderizar cada platillo
  const renderDish = ({ item }: any) => {
    const imageUrl =
      item.imageId && item.imageId.startsWith('http')
        ? item.imageId
        : `https://picsum.photos/seed/${item.id}/400/250`;

    return (
      <TouchableOpacity
        style={styles.dishCard}
        onPress={() => router.push(`/dish/${item.id}`)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.dishImage}
          contentFit="cover"
        />
        <View style={styles.dishInfo}>
          <Text style={[styles.dishName, { color: '#fff', fontSize: 22, fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={[styles.dishDescription, { color: colors.icon }]}
            numberOfLines={2}
          >
            {item.description || 'Sin descripción'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Platillos</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Aquí estarán todos los platillos disponibles
      </Text>

      {/* ✅ NUEVO: Lista de platillos solo del usuario */}
      <FlatList
        data={currentUser ? dishes.filter(d => d.userId === currentUser.id) : []}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        style={styles.dishList}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: colors.icon }}>
            No hay platillos aún. ¡Crea el primero!
          </Text>
        }
      />

      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.tint, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
          onPress={handleCrearPlatillo}
        >
          <Text style={[styles.createButtonText, { color: colors.background, marginRight: 8 }]}> 
            Crear Platillo
          </Text>
          <Text style={{ color: colors.background, fontSize: 22, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <ThemedText type="title">Crear Platillo</ThemedText>
            <Input
              placeholder="Nombre del platillo"
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              style={{ marginBottom: 12 }}
            />

            {/* 📸 NUEVO: Imagen del platillo */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 6, color: colors.text }}>
                Imagen del platillo (opcional)
              </Text>
              {imageUri ? (
                <>
                  <RNImage source={{ uri: imageUri }} style={styles.preview} />
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={[styles.imageButton, { borderColor: colors.tint }]}
                      onPress={handlePickImage}
                    >
                      <Text style={{ color: colors.tint }}>Cambiar imagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageButton} onPress={handleRemoveImage}>
                      <Text style={{ color: 'red' }}>Quitar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.imageButton, { borderColor: colors.tint }]}
                  onPress={handlePickImage}
                >
                  <Text style={{ color: colors.tint }}>Seleccionar imagen</Text>
                </TouchableOpacity>
              )}
            </View>

            {error ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
            ) : null}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.tint }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>
                  {loading ? 'Creando...' : 'Crear'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.icon }]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  paddingTop: 52, // margen superior un poco mayor
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  dishList: {
    flex: 1,
    width: '100%',
  },
  dishCard: {
    borderRadius: 12,
    overflow: 'hidden',
  backgroundColor: '#000',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dishImage: {
    width: '100%',
    height: 180,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  width: '70%',
  elevation: 12,
  shadowColor: '#000',
  shadowOpacity: 0.38,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 8,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
});
