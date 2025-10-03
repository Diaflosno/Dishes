import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import type { User as AppUser, Dish, Recipe } from '../lib/types';

// Mock data para desarrollo
const mockUsers: AppUser[] = [
  {
    id: '1',
    name: 'Chef María',
    email: 'maria@ejemplo.com',
    avatarImageId: 'user-avatar-1',
    bio: 'Amante de la cocina italiana',
    favoriteCuisines: ['Italiana', 'Mediterránea'],
    likedRecipeIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Carlos Gourmet',
    email: 'carlos@ejemplo.com',
    avatarImageId: 'user-avatar-2',
    bio: 'Especialista en comida rápida gourmet',
    favoriteCuisines: ['Americana', 'Asiática'],
    likedRecipeIds: ['3']
  }
];

const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Pasta Carbonara',
    description: 'Clásica pasta italiana con salsa carbonara cremosa',
    imageId: 'dish-pasta-carbonara',
    userId: '1'
  },
  {
    id: '2',
    name: 'Pollo Frito Estilo KFC',
    description: 'Pollo crujiente marinado con especias secretas',
    imageId: 'dish-kfc-chicken',
    userId: '2'
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    description: 'Pizza clásica con albahaca fresca y mozzarella',
    imageId: 'dish-pizza-margherita',
    userId: '1'
  },
  {
    id: '4',
    name: 'Sushi Variado',
    description: 'Plato de sushi con diferentes variedades frescas',
    imageId: 'dish-sushi-platter',
    userId: '2'
  },
  {
    id: '5',
    name: 'Tacos Mexicanos',
    description: 'Tacos auténticos con diversos ingredientes',
    imageId: 'dish-tacos',
    userId: '1'
  },
  {
    id: '6',
    name: 'Hamburguesa Gourmet',
    description: 'Hamburguesa jugosa con ingredientes premium',
    imageId: 'dish-burger',
    userId: '2'
  },
  {
    id: '7',
    name: 'Ramen Tradicional',
    description: 'Sopa de ramen con caldo rico y humeante',
    imageId: 'dish-ramen',
    userId: '1'
  }
];

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Carbonara Clásica de la Nonna',
    dishId: '1',
    userId: '1',
    ingredients: [
      '400g espagueti',
      '200g panceta',
      '4 huevos',
      '100g queso parmesano',
      'Pimienta negra',
      'Sal'
    ],
    instructions: [
      'Hierve la pasta en agua con sal',
      'Fríe la panceta hasta que esté crujiente',
      'Bate los huevos con el queso parmesano',
      'Mezcla la pasta caliente con la panceta',
      'Agrega la mezcla de huevo fuera del fuego',
      'Sirve inmediatamente con pimienta'
    ],
    imageId: 'dish-pasta-carbonara',
    cookingTime: 25,
    likes: 45
  },
  {
    id: '2',
    title: 'Carbonara con Champiñones',
    dishId: '1',
    userId: '2',
    ingredients: [
      '400g espagueti',
      '150g panceta',
      '200g champiñones',
      '3 huevos',
      '80g queso parmesano',
      'Ajo',
      'Perejil'
    ],
    instructions: [
      'Cocina la pasta según instrucciones',
      'Saltea champiñones con ajo',
      'Añade la panceta y cocina',
      'Mezcla huevos con queso',
      'Combina todo fuera del fuego',
      'Decora con perejil fresco'
    ],
    imageId: 'dish-pasta-carbonara',
    cookingTime: 30,
    likes: 32
  },
  {
    id: '3',
    title: 'Pollo Frito Crujiente',
    dishId: '2',
    userId: '2',
    ingredients: [
      '1 pollo entero cortado',
      '2 tazas harina',
      'Especias secretas',
      'Buttermilk',
      'Aceite para freír',
      'Sal y pimienta'
    ],
    instructions: [
      'Marina el pollo en buttermilk 4 horas',
      'Mezcla harina con especias',
      'Empaniza el pollo marinado',
      'Fríe en aceite a 175°C',
      'Cocina 12-15 minutos hasta dorar',
      'Escurre en papel absorbente'
    ],
    imageId: 'dish-kfc-chicken',
    cookingTime: 45,
    likes: 67
  },
  {
    id: '4',
    title: 'Pizza Margherita Casera',
    dishId: '3',
    userId: '1',
    ingredients: [
      'Masa de pizza',
      'Salsa de tomate',
      'Mozzarella fresca',
      'Albahaca fresca',
      'Aceite de oliva',
      'Sal marina'
    ],
    instructions: [
      'Precalienta el horno a 250°C',
      'Extiende la masa en forma circular',
      'Aplica salsa de tomate uniformemente',
      'Añade mozzarella en trozos',
      'Hornea 10-12 minutos',
      'Termina con albahaca y aceite'
    ],
    imageId: 'dish-pizza-margherita',
    cookingTime: 20,
    likes: 89
  }
];

type DataContextType = {
  users: AppUser[];
  dishes: Dish[];
  recipes: Recipe[];
  currentUser: AppUser | null;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'likes' | 'userId' | 'imageId'>, dishId: string) => Promise<void>;
  addDish: (dish: Omit<Dish, 'id' | 'userId' | 'imageId'>) => Promise<string>;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
  deleteDish: (dishId: string) => void;
  toggleLike: (recipeId: string) => void;
  logout: () => void;
  isDataLoaded: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(mockUsers[0]); // Usuario por defecto
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'likes' | 'userId' | 'imageId'>, dishId: string) => {
    if (!currentUser) throw new Error("User must be logged in to add a recipe.");
    
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) throw new Error("Dish not found.");

    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString(),
      userId: currentUser.id,
      imageId: dish.imageId,
      likes: 0,
    };

    setRecipes(prev => [...prev, newRecipe]);
  };

  const addDish = async (dishData: Omit<Dish, 'id' | 'userId' | 'imageId'>): Promise<string> => {
    if (!currentUser) throw new Error("User must be logged in to add a dish.");

    const newDish: Dish = {
      ...dishData,
      id: Date.now().toString(),
      userId: currentUser.id,
      imageId: `dish-${Date.now()}`,
    };

    setDishes(prev => [...prev, newDish]);
    return newDish.id;
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  const deleteRecipe = (recipeId: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const deleteDish = (dishId: string) => {
    setDishes(prev => prev.filter(dish => dish.id !== dishId));
    setRecipes(prev => prev.filter(recipe => recipe.dishId !== dishId));
  };

  const toggleLike = (recipeId: string) => {
    if (!currentUser) return;

    setRecipes(prev => 
      prev.map(recipe => {
        if (recipe.id === recipeId) {
          const isLiked = currentUser.likedRecipeIds?.includes(recipeId);
          return {
            ...recipe,
            likes: isLiked ? recipe.likes - 1 : recipe.likes + 1
          };
        }
        return recipe;
      })
    );

    setUsers(prev => 
      prev.map(user => {
        if (user.id === currentUser.id) {
          const likedRecipeIds = user.likedRecipeIds || [];
          const isLiked = likedRecipeIds.includes(recipeId);
          
          return {
            ...user,
            likedRecipeIds: isLiked 
              ? likedRecipeIds.filter(id => id !== recipeId)
              : [...likedRecipeIds, recipeId]
          };
        }
        return user;
      })
    );

    // Actualizar currentUser también
    const likedRecipeIds = currentUser.likedRecipeIds || [];
    const isLiked = likedRecipeIds.includes(recipeId);
    
    setCurrentUser({
      ...currentUser,
      likedRecipeIds: isLiked 
        ? likedRecipeIds.filter(id => id !== recipeId)
        : [...likedRecipeIds, recipeId]
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const contextValue = useMemo(() => ({
    users,
    dishes,
    recipes,
    currentUser,
    addRecipe,
    addDish,
    updateRecipe,
    deleteRecipe,
    deleteDish,
    toggleLike,
    logout,
    isDataLoaded,
  }), [users, dishes, recipes, currentUser, isDataLoaded]);

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