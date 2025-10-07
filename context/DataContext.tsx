import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Unsubscribe,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { authService } from "../firebase/authService";
import { firestore } from "../firebase/config";
import type { User as AppUser, Dish, Recipe } from "../lib/types";

type DataContextType = {
  dishes: Dish[];
  recipes: Recipe[];
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  addRecipe: (recipe: Omit<Recipe, "id" | "likes" | "userId">) => Promise<void>;
  addDish: (
    dish: Omit<Dish, "id" | "userId" | "imageId">,
    imageId?: string
  ) => Promise<string>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  deleteDish: (dishId: string) => Promise<void>;
  toggleLike: (recipeId: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDataLoaded: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const unsubscribeListeners = useRef<Unsubscribe[]>([]);

  useEffect(() => {
    const authUnsubscribe = authService.onAuthStateChanged(
      async (firebaseUser: any) => {
        unsubscribeListeners.current.forEach((unsubscribe) => unsubscribe());
        unsubscribeListeners.current = [];

        if (firebaseUser) {
          const userDocRef = doc(firestore, "users", firebaseUser.uid);

          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, {
              name: firebaseUser.displayName || "Usuario Anónimo",
              email: firebaseUser.email || "",
              avatarImageId: "",
              bio: "",
              favoriteCuisines: [],
              likedRecipeIds: [],
            });
          }

          const userUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setCurrentUser({ id: docSnap.id, ...docSnap.data() } as AppUser);
            }
          });

          const dishesUnsubscribe = onSnapshot(
            collection(firestore, "dishes"),
            (snapshot) => {
              const dishesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Dish[];
              setDishes(dishesData);
            }
          );

          const recipesUnsubscribe = onSnapshot(
            collection(firestore, "recipes"),
            (snapshot) => {
              const recipesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Recipe[];
              setRecipes(recipesData);
            }
          );

          unsubscribeListeners.current = [
            userUnsubscribe,
            dishesUnsubscribe,
            recipesUnsubscribe,
          ];

          setIsAuthenticated(true);
          setIsDataLoaded(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setDishes([]);
          setRecipes([]);
          setIsDataLoaded(true);
        }
      }
    );

    return () => authUnsubscribe();
  }, []);

  const addDish = useCallback(
    async (
      dish: Omit<Dish, "id" | "userId" | "imageId">,
      imageId: string = ""
    ) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const newDish = { ...dish, userId: currentUser.id, imageId };
      const docRef = await addDoc(collection(firestore, "dishes"), newDish);
      return docRef.id;
    },
    [currentUser]
  );

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "likes" | "userId">) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const newRecipe = { ...recipe, userId: currentUser.id, likes: 0 };
      await addDoc(collection(firestore, "recipes"), newRecipe);
    },
    [currentUser]
  );

  const updateRecipe = useCallback(async (updatedRecipe: Recipe) => {
  if (!currentUser) throw new Error("Usuario no autenticado.");

  const recipeRef = doc(firestore, "recipes", updatedRecipe.id);

  // Verificar que el usuario sea el creador
  const recipeSnap = await getDoc(recipeRef);
  if (!recipeSnap.exists()) throw new Error("La receta no existe.");
  const recipeData = recipeSnap.data();
  if (recipeData.userId !== currentUser.id) {
    throw new Error("No tienes permiso para editar esta receta.");
  }

  await updateDoc(recipeRef, {
    title: updatedRecipe.title,
    ingredients: updatedRecipe.ingredients,
    steps: updatedRecipe.steps,
    cookingTime: updatedRecipe.cookingTime,
    imageUrl: updatedRecipe.imageUrl,
  });
}, [currentUser]);

  const deleteRecipe = useCallback(
    async (recipeId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const recipeRef = doc(firestore, "recipes", recipeId);
      await deleteDoc(recipeRef);
    },
    [currentUser]
  );

  const deleteDish = useCallback(
    async (dishId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const batch = writeBatch(firestore);
      const dishRef = doc(firestore, "dishes", dishId);
      batch.delete(dishRef);
      const dishRecipes = recipes.filter((r) => r.dishId === dishId);
      dishRecipes.forEach((recipe) => {
        const recipeRef = doc(firestore, "recipes", recipe.id);
        batch.delete(recipeRef);
      });
      await batch.commit();
    },
    [currentUser, recipes]
  );

  // ✅ toggleLike corregido
  const toggleLike = useCallback(
    async (recipeId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const userRef = doc(firestore, "users", currentUser.id);
      const recipeRef = doc(firestore, "recipes", recipeId);

      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: currentUser.name || "Usuario Anónimo",
          email: currentUser.email || "",
          avatarImageId: currentUser.avatarImageId || "",
          bio: currentUser.bio || "",
          favoriteCuisines: currentUser.favoriteCuisines || [],
          likedRecipeIds: [],
        });
      }

      const isLiked = currentUser.likedRecipeIds?.includes(recipeId);
      const batch = writeBatch(firestore);
      batch.update(
        userRef,
        isLiked
          ? { likedRecipeIds: arrayRemove(recipeId) }
          : { likedRecipeIds: arrayUnion(recipeId) }
      );
      batch.update(recipeRef, { likes: increment(isLiked ? -1 : 1) });
      await batch.commit();

      setCurrentUser((prev: AppUser | null) =>
        prev
          ? {
              ...prev,
              likedRecipeIds: isLiked
                ? (prev.likedRecipeIds || []).filter(
                    (id: string) => id !== recipeId
                  )
                : [...(prev.likedRecipeIds || []), recipeId],
            }
          : prev
      );
    },
    [currentUser]
  );

  const signOut = useCallback(async () => {
    try {
      unsubscribeListeners.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeListeners.current = [];
      await authService.signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      dishes,
      recipes,
      currentUser,
      isAuthenticated,
      addRecipe,
      addDish,
      updateRecipe,
      deleteRecipe,
      deleteDish,
      toggleLike,
      signOut,
      isDataLoaded,
    }),
    [
      dishes,
      recipes,
      currentUser,
      isAuthenticated,
      isDataLoaded,
      addDish,
      addRecipe,
      deleteDish,
      deleteRecipe,
      toggleLike,
      updateRecipe,
      signOut,
    ]
  );

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData debe ser usado dentro de un DataProvider");
  }
  return context;
}
