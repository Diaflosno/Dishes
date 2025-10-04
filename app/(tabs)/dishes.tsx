import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DishesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { addDish } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrearPlatillo = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    setError('');
    if (!name.trim() || !description.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      await addDish({ name, description });
      setModalVisible(false);
      setName('');
      setDescription('');
    } catch (e) {
      setError('Error al crear el platillo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Platillos</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>Aquí estarán todos los platillos disponibles</Text>
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.tint }]} onPress={handleCrearPlatillo}>
          <Text style={[styles.createButtonText, { color: colors.background }]}>Crear Platillo</Text>
        </TouchableOpacity>
      </View>
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
            {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.tint }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>{loading ? 'Creando...' : 'Crear'}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.icon }]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>Cancelar</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 0,
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
});