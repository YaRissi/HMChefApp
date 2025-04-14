import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, User } from './AuthContext';
import { Alert } from 'react-native';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUri: string;
}

interface RecipeContextType {
  allrecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  checkIfRecipeExists: (id: string) => boolean;
  clearRecipes: () => void;
}

const RecipeContext = createContext<RecipeContextType>({
  allrecipes: [],
  addRecipe: () => {},
  deleteRecipe: () => {},
  checkIfRecipeExists: () => false,
  clearRecipes: () => {},
});

export const useRecipes = () => useContext(RecipeContext);

const STORAGE_KEY = 'recipes';

const saveRecipesToStorage = async (recipes: Recipe[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Fehler beim Speichern der Rezepte:', error);
  }
};
const loadRecipesFromStorage = async (user: User | null) => {
  try {
    if (!user) {
      const storedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedRecipes) {
        return JSON.parse(storedRecipes) as Recipe[];
      }
      return [];
    } else {
      const response = await fetch(`${process.env.API_URL}/api/recipes?user=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      const data = await response.json();
      return data.recipes || [];
    }
  } catch (error) {
    console.error('Fehler beim Laden der Rezepte:', error);
    return [];
  }
};

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [initialLoading, setinitialLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await loadRecipesFromStorage(user);
        setRecipes(storedRecipes);
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
        await saveRecipesToStorage(recipes);
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
    if (user) {
      fetch(`${process.env.API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.access_token}`,
        },
        body: JSON.stringify(newrecipe),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setRecipes(prevRecipes => [...prevRecipes, newrecipe]);
          } else {
            Alert.alert('Fehler', 'Das Rezept konnte nicht hinzugefügt werden.');
          }
        })
        .catch(() => {
          Alert.alert('Fehler', 'Das Rezept konnte nicht hinzugefügt werden.');
        });
    } else {
      setRecipes(prevRecipes => [...prevRecipes, newrecipe]);
    }
  };

  const deleteRecipe = (id: string) => {
    if (user) {
      fetch(`${process.env.API_URL}/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
          } else {
            Alert.alert('Fehler', 'Das Rezept konnte nicht gelöscht werden.');
          }
        })
        .catch(() => {
          Alert.alert('Fehler', 'Das Rezept konnte nicht gelöscht werden.');
        });
    } else {
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
    }
  };

  const checkIfRecipeExists = (id: string) => {
    return recipes.some(recipe => recipe.id === id);
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  return (
    <RecipeContext.Provider
      value={{ allrecipes: recipes, addRecipe, deleteRecipe, checkIfRecipeExists, clearRecipes }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
