import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Configuración de Firebase (CORREGIDA)
const firebaseConfig = {
  apiKey: "AIzaSyCuaLw-XEL-LTFY277QioI4QszR-YG4NHo",
  authDomain: "studio-8785522686-5df11.firebaseapp.com",
  projectId: "studio-8785522686-5df11",
  storageBucket: "studio-8785522686-5df11.firebasestorage.app", // ✅ CORREGIDO AQUÍ
  messagingSenderId: "349458674888",
  appId: "1:349458674888:web:43922d814613fd32ab61fd"
};

// ✅ Inicializar app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Firestore y Storage
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export { auth };
export default app;
