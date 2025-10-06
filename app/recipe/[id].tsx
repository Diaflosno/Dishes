import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Clock, Heart } from 'lucide-react-native';

import { useData } from '@/context/DataContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { placeholderImages } from '@/lib/placeholder-images.json';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes } = useData();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const recipe = useMemo(() => recipes.find(r => r.id === id), [recipes, id]);
  const image = useMemo(() => placeholderImages.find(img => img.id === recipe?.imageId), [recipe]);

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Receta no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: recipe.title }} />
      <ScrollView>
        <Image
          source={{ uri: image?.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/400` }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.icon} />
              <Text style={[styles.infoText, { color: colors.icon }]}>{recipe.cookingTime} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Heart size={16} color={colors.icon} />
              <Text style={[styles.infoText, { color: colors.icon }]}>{recipe.likes} Me gusta</Text>
            </View>
          </View>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredientes</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={[styles.listItem, { color: colors.text }]}>• {ingredient}</Text>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Instrucciones</Text>
          {recipe.instructions.map((instruction, index) => (
            <Text key={index} style={[styles.listItem, { color: colors.text, lineHeight: 22 }]}>
              {index + 1}. {instruction}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});