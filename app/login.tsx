import { Colors } from '@/constants/theme';
import { authService } from '@/firebase/authService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const heroImage = placeholderImages.find(img => img.id === 'hero-main');


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      // La navegación se manejará automáticamente por el estado de autenticación
    } catch (error: any) {
      Alert.alert('Error de inicio de sesión', error.message || 'No se pudo iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await authService.registerWithEmail(email, password);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
    } catch (error: any) {
      Alert.alert('Error de registro', error.message || 'No se pudo registrar el usuario.');
    } finally {
      setIsRegistering(false);
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
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>¡Bienvenido!</Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.icon }]}>Inicia sesión para explorar miles de recetas deliciosas</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.icon + '40' }]}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.icon}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.icon + '40' }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.icon}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.tint }]}
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Text style={[styles.loginButtonText, { color: colors.background }]}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, { borderColor: colors.tint }]}
          onPress={handleRegister}
          disabled={isRegistering || !email || !password}
        >
          {isRegistering ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : (
            <Text style={[styles.registerButtonText, { color: colors.tint }]}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.icon }]}>Al continuar, aceptas nuestros términos de servicio y política de privacidad</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  heroImage: {
    position: 'absolute',
    width: '80%',
    height: 140,
    opacity: 0.25,
    borderRadius: 16,
    alignSelf: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
    marginBottom: 32,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 340,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  input: {
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 2,
    width: '100%',
    minWidth: 180,
    maxWidth: 340,
    color: '#000', // Pure black text
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    maxWidth: 340,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 18,
    width: '100%',
    maxWidth: 340,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});