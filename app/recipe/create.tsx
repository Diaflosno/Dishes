import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
// Se eliminó 'View' de las importaciones
import { Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';

import { useData } from '@/context/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Input } from '@/components/ui/input';

type FormData = {
  title: string;
  cookingTime: string;
  ingredients: string;
  instructions: string;
};

export default function CreateRecipeScreen() {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { addRecipe } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!dishId) {
      Alert.alert('Error', 'No se ha proporcionado un platillo para añadir la receta.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const recipeData = {
        title: data.title,
        cookingTime: parseInt(data.cookingTime, 10),
        ingredients: data.ingredients.split('\n').filter(line => line.trim() !== ''),
        instructions: data.instructions.split('\n').filter(line => line.trim() !== ''),
        imageId: '',
        dishId: dishId,
      };

      await addRecipe(recipeData); // Ahora solo pasamos un argumento

      Alert.alert('¡Éxito!', 'Tu receta ha sido añadida.');
      router.back();
    } catch (error) {
      console.error("Error al añadir la receta:", error);
      Alert.alert('Error', 'No se pudo añadir la receta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Añadir Nueva Receta' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Nueva Receta</Text>
        
        <Controller
          control={control}
          rules={{ required: 'El título es obligatorio.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Título de la receta"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={errors.title && styles.inputError}
            />
          )}
          name="title"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

        <Controller
          control={control}
          rules={{ 
            required: 'El tiempo es obligatorio.',
            pattern: { value: /^[0-9]+$/, message: 'Solo se admiten números.' }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Tiempo de preparación (en minutos)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              style={errors.cookingTime && styles.inputError}
            />
          )}
          name="cookingTime"
        />
        {errors.cookingTime && <Text style={styles.errorText}>{errors.cookingTime.message}</Text>}

        <Controller
          control={control}
          rules={{ required: 'Los ingredientes son obligatorios.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Ingredientes (uno por línea)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.icon, color: colors.text }, errors.ingredients && styles.inputError]}
              placeholderTextColor={colors.icon}
            />
          )}
          name="ingredients"
        />
        {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients.message}</Text>}

        <Controller
          control={control}
          rules={{ required: 'Las instrucciones son obligatorias.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Instrucciones (un paso por línea)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.icon, color: colors.text }, errors.instructions && styles.inputError]}
              placeholderTextColor={colors.icon}
            />
          )}
          name="instructions"
        />
        {errors.instructions && <Text style={styles.errorText}>{errors.instructions.message}</Text>}

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.tint }]} 
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.submitButtonText, { color: colors.background }]}>Publicar Receta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
  },
});