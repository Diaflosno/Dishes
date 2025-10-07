export type User = {
  id: string;
  name: string;
  email: string;
  avatarImageId: string;
  bio: string;
  favoriteCuisines: string[];
  likedRecipeIds?: string[];
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  imageId: string;
  userId: string; // Added to track dish ownership
};

export type Recipe = {
  id: string;
  title: string;
  dishId: string;
  userId: string;

  // ✅ Ingredientes: pueden venir como array o string, así evitamos el error de .split()
  ingredients: string[] | string;

  // ✅ Cambiar 'instructions' por 'steps' para que coincida con lo que usas en el código
  steps?: string;

  // ✅ imageUrl en lugar de imageId, porque usamos URL completa en la app
  imageUrl?: string;

  // ⏱️ Mantiene el tiempo de cocción, pero opcional por si no se envía
  cookingTime?: number;

  // ❤️ Número de likes (opcional también)
  likes?: number;
};
