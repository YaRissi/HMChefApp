import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUri: string | null;
}

interface RecipeContextType {
  allrecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (newRecipe: Recipe) => {
    const newrecipe = {
      ...newRecipe,
      id: newRecipe.id || Date.now().toString(),
    };
    setRecipes(prevRecipes => [...prevRecipes, newrecipe]);
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
  };

  return (
    <RecipeContext.Provider value={{ allrecipes: recipes, addRecipe, deleteRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
