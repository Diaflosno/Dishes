import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../firebase/authService';
import type { User as AppUser, Dish, Recipe } from '../lib/types';


type DataContextType = {
  dishes: Dish[];
  recipes: Recipe[];
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'likes' | 'userId' | 'imageId'>, dishId: string) => Promise<void>;
  addDish: (dish: Omit<Dish, 'id' | 'userId' | 'imageId'>) => Promise<string>;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
  deleteDish: (dishId: string) => void;
  toggleLike: (recipeId: string) => void;
  signOut: () => Promise<void>;
  isDataLoaded: boolean;
};


const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with real Firestore/Realtime DB fetches for dishes/recipes
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // You should fetch user profile from Firestore here if needed
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
        });
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setIsDataLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // All CRUD methods should be implemented to use Firestore/Realtime DB
  const addRecipe = async () => { throw new Error('Implementar con Firestore'); };
  const addDish = async () => { throw new Error('Implementar con Firestore'); };
  const updateRecipe = () => { throw new Error('Implementar con Firestore'); };
  const deleteRecipe = () => { throw new Error('Implementar con Firestore'); };
  const deleteDish = () => { throw new Error('Implementar con Firestore'); };
  const toggleLike = () => { throw new Error('Implementar con Firestore'); };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const contextValue = useMemo(() => ({
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
  }), [dishes, recipes, currentUser, isAuthenticated, isDataLoaded]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}