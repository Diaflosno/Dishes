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
  ingredients: string[];
  instructions: string[];
  imageId: string;
  cookingTime: number; // in minutes
  likes: number;
};