// context/DataContext.tsx
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
  writeBatch,
  increment,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { authService } from "@/firebase/authService";
import type { User as AppUser, Dish, Recipe } from "@/lib/types";

type DataContextType = {
  dishes: Dish[];
  recipes: Recipe[];
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  isDataLoaded: boolean;

  // dishes
  addDish: (dish: Omit<Dish, "id" | "userId" | "imageId">, imageId?: string) => Promise<string>;
  updateDish: (dishId: string, data: Partial<Pick<Dish, "name" | "imageId">>) => Promise<void>;
  deleteDish: (dishId: string) => Promise<void>;

  // recipes
  addRecipe: (recipe: Omit<Recipe, "id" | "likes" | "userId">) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;

  // social
  toggleLike: (recipeId: string) => Promise<void>;

  // auth
  signOut: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const unsubscribeRefs = useRef<Unsubscribe[]>([]);

  useEffect(() => {
    const unsub = authService.onAuthStateChanged(async (fbUser) => {
      // Limpia listeners anteriores
      unsubscribeRefs.current.forEach((fn) => fn());
      unsubscribeRefs.current = [];

      if (!fbUser) {
        setCurrentUser(null);
        setDishes([]);
        setRecipes([]);
        setIsAuthenticated(false);
        setIsDataLoaded(true);
        return;
      }

      // Asegurar doc de usuario
      const userRef = doc(firestore, "users", fbUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: fbUser.displayName || "Usuario Anónimo",
          email: fbUser.email || "",
          avatarImageId: "",
          bio: "",
          favoriteCuisines: [],
          likedRecipeIds: [],
        });
      }

      const unsubUser = onSnapshot(userRef, (ds) => {
        if (ds.exists()) {
          setCurrentUser({ id: ds.id, ...(ds.data() as Omit<AppUser, "id">) });
        }
      });

      const unsubDishes = onSnapshot(collection(firestore, "dishes"), (qs) => {
        const arr = qs.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Dish, "id">) }));
        setDishes(arr);
      });

      const unsubRecipes = onSnapshot(collection(firestore, "recipes"), (qs) => {
        const arr = qs.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Recipe, "id">) }));
        setRecipes(arr);
      });

      unsubscribeRefs.current = [unsubUser, unsubDishes, unsubRecipes];
      setIsAuthenticated(true);
      setIsDataLoaded(true);
    });

    return () => unsub();
  }, []);

  // ---------- Dishes ----------
  const addDish = useCallback(
    async (dish: Omit<Dish, "id" | "userId" | "imageId">, imageId: string = "") => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const docRef = await addDoc(collection(firestore, "dishes"), {
        ...dish,
        userId: currentUser.id,
        imageId,
      });
      return docRef.id;
    },
    [currentUser]
  );

  const updateDish = useCallback(
    async (dishId: string, data: Partial<Pick<Dish, "name" | "imageId">>) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");

      const dishRef = doc(firestore, "dishes", dishId);
      const snap = await getDoc(dishRef);
      if (!snap.exists()) throw new Error("El platillo no existe.");

      const dishData = snap.data() as Dish;
      if (dishData.userId !== currentUser.id) {
        throw new Error("No tienes permiso para editar este platillo.");
      }

      await updateDoc(dishRef, { ...data });
    },
    [currentUser]
  );

  const deleteDish = useCallback(
    async (dishId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");

      const dishRef = doc(firestore, "dishes", dishId);
      const snap = await getDoc(dishRef);
      if (!snap.exists()) throw new Error("El platillo no existe.");
      const dishData = snap.data() as Dish;
      if (dishData.userId !== currentUser.id) {
        throw new Error("No tienes permiso para borrar este platillo.");
      }

      // Borra platillo y sus recetas
      const batch = writeBatch(firestore);
      batch.delete(dishRef);
      recipes
        .filter((r) => r.dishId === dishId)
        .forEach((r) => batch.delete(doc(firestore, "recipes", r.id)));
      await batch.commit();
    },
    [currentUser, recipes]
  );

  // ---------- Recipes ----------
  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "likes" | "userId">) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      await addDoc(collection(firestore, "recipes"), {
        ...recipe,
        userId: currentUser.id,
        likes: 0,
      });
    },
    [currentUser]
  );

  const updateRecipe = useCallback(
    async (updatedRecipe: Recipe) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const ref = doc(firestore, "recipes", updatedRecipe.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("La receta no existe.");
      const data = snap.data() as Recipe;
      if (data.userId !== currentUser.id) {
        throw new Error("No tienes permiso para editar esta receta.");
      }
      await updateDoc(ref, {
        title: updatedRecipe.title,
        ingredients: updatedRecipe.ingredients,
        steps: updatedRecipe.steps,
        cookingTime: updatedRecipe.cookingTime,
        imageUrl: updatedRecipe.imageUrl,
      });
    },
    [currentUser]
  );

  const deleteRecipe = useCallback(
    async (recipeId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const ref = doc(firestore, "recipes", recipeId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const recipe = snap.data() as Recipe;
      // Permitir al dueño de la receta o al dueño del platillo
      const dishRef = doc(firestore, "dishes", recipe.dishId);
      const dishSnap = await getDoc(dishRef);
      const dish = dishSnap.exists() ? (dishSnap.data() as Dish) : null;

      const canDelete =
        recipe.userId === currentUser.id || (dish && dish.userId === currentUser.id);
      if (!canDelete) throw new Error("No tienes permiso para borrar esta receta.");

      await deleteDoc(ref);
    },
    [currentUser]
  );

  // ---------- Social ----------
  const toggleLike = useCallback(
    async (recipeId: string) => {
      if (!currentUser) throw new Error("Usuario no autenticado.");
      const userRef = doc(firestore, "users", currentUser.id);
      const recipeRef = doc(firestore, "recipes", recipeId);

      const isLiked = (currentUser.likedRecipeIds || []).includes(recipeId);

      const batch = writeBatch(firestore);
      batch.update(
        userRef,
        isLiked ? { likedRecipeIds: arrayRemove(recipeId) } : { likedRecipeIds: arrayUnion(recipeId) }
      );
      batch.update(recipeRef, { likes: increment(isLiked ? -1 : 1) });
      await batch.commit();

      // Actualización optimista local
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              likedRecipeIds: isLiked
                ? (prev.likedRecipeIds || []).filter((id) => id !== recipeId)
                : [...(prev.likedRecipeIds || []), recipeId],
            }
          : prev
      );
    },
    [currentUser]
  );

  // ---------- Auth ----------
  const signOut = useCallback(async () => {
    unsubscribeRefs.current.forEach((fn) => fn());
    unsubscribeRefs.current = [];
    await authService.signOut();
  }, []);

  const value = useMemo<DataContextType>(
    () => ({
      dishes,
      recipes,
      currentUser,
      isAuthenticated,
      isDataLoaded,

      addDish,
      updateDish,
      deleteDish,

      addRecipe,
      updateRecipe,
      deleteRecipe,

      toggleLike,
      signOut,
    }),
    [
      dishes,
      recipes,
      currentUser,
      isAuthenticated,
      isDataLoaded,
      addDish,
      updateDish,
      deleteDish,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      toggleLike,
      signOut,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider");
  return ctx;
}