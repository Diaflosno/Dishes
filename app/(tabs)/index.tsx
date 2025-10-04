import { Image } from 'expo-image';
import { Search, UtensilsCrossed } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { useSearch } from '@/context/SearchContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Dish } from '@/lib/types';

const { width } = Dimensions.get('window');

function DishCard({ dish }: { dish: Dish }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { recipes } = useData();
  
  const recipeCount = recipes.filter(r => r.dishId === dish.id).length;
  const image = placeholderImages.find(img => img.id === dish.imageId);

  return (
    <TouchableOpacity style={styles.dishCardContainer}>
      <Card style={styles.dishCard}>
        <CardHeader style={styles.cardHeader}>
          <Image
            source={{ uri: image?.imageUrl || `https://picsum.photos/seed/${dish.id}/400/250` }}
            style={styles.dishImage}
            contentFit="cover"
          />
        </CardHeader>
        <CardContent style={styles.cardContent}>
          <Text style={[styles.dishName, { color: colors.text }]} numberOfLines={2}>
            {dish.name}
          </Text>
          <View style={styles.recipeInfo}>
            <UtensilsCrossed size={16} color={colors.icon} />
            <Text style={[styles.recipeCount, { color: colors.icon }]}>
              {recipeCount} {recipeCount === 1 ? 'receta' : 'recetas'}
            </Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

function DishCardSkeleton() {
  return (
    <View style={styles.dishCardContainer}>
      <Card style={styles.dishCard}>
        <Skeleton width={width * 0.43} height={150} style={styles.skeletonImage} />
        <CardContent style={styles.cardContent}>
          <Skeleton width={120} height={16} style={styles.skeletonTitle} />
          <Skeleton width={80} height={12} style={styles.skeletonSubtitle} />
        </CardContent>
      </Card>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { searchValue, setSearchValue } = useSearch();
  const { dishes, recipes, isDataLoaded } = useData();
  
  const heroImage = placeholderImages.find(img => img.id === 'hero-main');

  const filteredDishes = useMemo(() => {
    if (!isDataLoaded) return [];

    if (!searchValue) {
      return dishes;
    }

    const lowercasedSearch = searchValue.toLowerCase();

    const dishIdsFromRecipes = recipes
      .filter(recipe => 
        recipe.title.toLowerCase().includes(lowercasedSearch) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercasedSearch))
      )
      .map(recipe => recipe.dishId);

    const filtered = dishes.filter(dish =>
      dish.name.toLowerCase().includes(lowercasedSearch) ||
      dishIdsFromRecipes.includes(dish.id)
    );

    const uniqueDishIds = new Set(filtered.map(d => d.id));
    return dishes.filter(d => uniqueDishIds.has(d.id));

  }, [searchValue, dishes, recipes, isDataLoaded]);

  const renderDishItem = ({ item }: { item: Dish }) => (
    <DishCard dish={item} />
  );

  const renderSkeletonItem = ({ index }: { index: number }) => (
    <DishCardSkeleton key={index} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.tint + '20' }]}>
          {heroImage && (
            <Image
              source={{ uri: heroImage.imageUrl }}
              style={styles.heroImage}
              contentFit="cover"
            />
          )}
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              Encuentra tu Próxima{'\n'}Receta Favorita
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.icon }]}>
              Explora miles de recetas para cualquier platillo que puedas imaginar
            </Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color={colors.icon} style={styles.searchIcon} />
                <Input
                  style={[styles.searchInput, { backgroundColor: colors.background + 'CC' }]}
                  placeholder="Busca un platillo, receta o ingrediente..."
                  value={searchValue}
                  onChangeText={setSearchValue}
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Dishes Section */}
        <View style={styles.dishesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchValue ? `Resultados para "${searchValue}"` : "Platillos Populares"}
          </Text>
          
          {!isDataLoaded ? (
            <FlatList
              data={Array(6).fill(null)}
              renderItem={renderSkeletonItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}
            />
          ) : filteredDishes.length > 0 ? (
            <FlatList
              data={filteredDishes}
              renderItem={renderDishItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                No se encontraron platillos. Intenta con otro término de búsqueda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  heroOverlay: {
    padding: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  searchContainer: {
    width: '100%',
    maxWidth: 400,
  },
  searchInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 40,
    fontSize: 16,
  },
  dishesSection: {
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dishCardContainer: {
    width: width * 0.43,
  },
  dishCard: {
    height: 220,
  },
  cardHeader: {
    padding: 0,
  },
  dishImage: {
    width: '100%',
    height: 150,
  },
  skeletonImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recipeCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  skeletonTitle: {
    marginBottom: 8,
  },
  skeletonSubtitle: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
