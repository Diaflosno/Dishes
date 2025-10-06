import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Clock, Heart } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { placeholderImages } from '@/lib/placeholder-images.json';
import type { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Busca una imagen de placeholder o usa una por defecto
  const image = placeholderImages.find(img => img.id === recipe.imageId);

  return (
    <Link href={{ pathname: '/recipe/[id]', params: { id: recipe.id } }} asChild>
      <TouchableOpacity>
        <Card style={styles.card}>
          <Image
            source={{ uri: image?.imageUrl || `https://picsum.photos/seed/${recipe.id}/300/200` }}
            style={styles.image}
            contentFit="cover"
          />
          <CardContent style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {recipe.title}
            </Text>
            <View style={styles.footer}>
              <View style={styles.infoItem}>
                <Clock size={14} color={colors.icon} />
                <Text style={[styles.infoText, { color: colors.icon }]}>
                  {recipe.cookingTime} min
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Heart size={14} color={colors.icon} />
                <Text style={[styles.infoText, { color: colors.icon }]}>
                  {recipe.likes}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
});