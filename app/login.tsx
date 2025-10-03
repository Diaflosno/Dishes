import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { placeholderImages } from '@/lib/placeholder-images.json';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { signInWithGoogle } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const heroImage = placeholderImages.find(img => img.id === 'hero-main');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // La navegación se manejará automáticamente por el estado de autenticación
    } catch (error: any) {
      console.error('Error en Google Sign-In:', error);
      Alert.alert(
        'Error de inicio de sesión',
        'No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Dishes
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.icon }]}>
            Tu recetario personal
          </Text>
        </View>
      </View>

      {/* Login Section */}
      <View style={styles.loginSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          ¡Bienvenido!
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.icon }]}>
          Inicia sesión para explorar miles de recetas deliciosas
        </Text>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={[
            styles.googleButton,
            { 
              backgroundColor: colors.background,
              borderColor: colors.icon + '40',
            }
          ]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : (
            <>
              {/* Google Icon */}
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={[styles.googleButtonText, { color: colors.text }]}>
                Continuar con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.icon }]}>
          Al continuar, aceptas nuestros términos de servicio y política de privacidad
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  heroOverlay: {
    alignItems: 'center',
    zIndex: 1,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  loginSection: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});