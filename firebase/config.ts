import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase del proyecto studio
const firebaseConfig = {
  projectId: "studio-8785522686-5df11",
  appId: "1:349458674888:web:43922d814613fd32ab61fd",
  apiKey: "AIzaSyCuaLw-XEL-LTFY277QioI4QszR-YG4NHo",
  authDomain: "studio-8785522686-5df11.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "349458674888"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;