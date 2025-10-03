import { signInAnonymously, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  // Simulación de inicio de sesión con Google (usando anonymous auth por ahora)
  async signInWithGoogle(): Promise<AuthUser | null> {
    try {
      console.log('Iniciando sesión anónima (simulando Google Sign-In)...');
      
      // Por ahora usamos autenticación anónima para simular Google
      const result = await signInAnonymously(auth);
      
      // Simular datos de usuario de Google
      const mockGoogleUser: AuthUser = {
        uid: result.user.uid,
        email: 'usuario@ejemplo.com',
        displayName: 'Usuario de Prueba',
        photoURL: null,
      };
      
      console.log('Sesión iniciada exitosamente (modo simulación)');
      return mockGoogleUser;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Verificar si el usuario está autenticado
  isSignedIn(): boolean {
    return auth.currentUser !== null;
  }

  // Escuchar cambios en el estado de autenticación
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService();