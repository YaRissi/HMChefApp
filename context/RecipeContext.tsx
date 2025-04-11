import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  clearRecipes: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => useContext(RecipeContext);

const STORAGE_KEY = 'recipes';

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [initialLoading, setinitialLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
        setinitialLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Rezepte:', error);
      }
    };

    loadRecipes();
  }, []);

  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
      } catch (error) {
        console.error('Fehler beim Speichern der Rezepte:', error);
      }
    };
    if (!initialLoading) {
      saveRecipes();
    }
  }, [recipes, initialLoading]);

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

  const clearRecipes = () => {
    setRecipes([]);
  };

  return (
    <RecipeContext.Provider value={{ allrecipes: recipes, addRecipe, deleteRecipe, clearRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};
