import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-8785522686-5df11",
  appId: "1:349458674888:web:43922d814613fd32ab61fd",
  apiKey: "AIzaSyCuaLw-XEL-LTFY277QioI4QszR-YG4NHo",
  authDomain: "studio-8785522686-5df11.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "349458674888"
};

// --- ARREGLO DEFINITIVO ---
// Esto asegura que Firebase solo se inicialice una vez, evitando errores de "already-initialized"
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializamos Auth de forma explícita con la persistencia de React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// -----------------------------

export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { auth }; // Exportamos la instancia de auth directamente
export default app;