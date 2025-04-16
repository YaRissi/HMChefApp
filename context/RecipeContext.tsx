import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthState, User } from './AuthState';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUri: string;
}

interface RecipeContextType {
  allrecipes: Recipe[];
  addRecipe: (recipe: Recipe, image?: ImagePicker.ImagePickerAsset) => void;
  addRecipeLocal: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  checkIfRecipeExists: (id: string) => boolean;
  clearRecipes: () => void;
}

const RecipeContext = createContext<RecipeContextType>({
  allrecipes: [],
  addRecipe: () => {},
  addRecipeLocal: () => {},
  deleteRecipe: () => {},
  checkIfRecipeExists: () => false,
  clearRecipes: () => {},
});

export const useRecipes = () => useContext(RecipeContext);

const STORAGE_KEY = 'recipes';

const saveRecipesToStorage = async (recipes: Recipe[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    Alert.alert('Error', 'Failed to save recipes.');
  }
};
export const loadRecipesFromStorage = async (user: User | null) => {
  try {
    if (!user) {
      const storedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedRecipes) {
        return JSON.parse(storedRecipes) as Recipe[];
      }
      return [];
    }
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/recipes?user=${user.username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.access_token}`,
        },
      },
    );
    const data = await response.json();
    return data.recipes || [];
  } catch {
    return [];
  }
};

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [initialLoading, setinitialLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    const loadRecipes = async () => {
      const storedRecipes = await loadRecipesFromStorage(user);
      setRecipes(storedRecipes);
      setinitialLoading(false);
    };

    loadRecipes();
  }, [user]);

  useEffect(() => {
    const saveRecipes = async () => {
      await saveRecipesToStorage(recipes);
    };
    if (!initialLoading) {
      saveRecipes();
    }
  }, [recipes, initialLoading]);

  const addRecipeLocal = (recipe: Recipe) => {
    setRecipes(prevRecipes => [...prevRecipes, recipe]);
  };

  const addRecipe = async (newRecipe: Recipe, image?: ImagePicker.ImagePickerAsset) => {
    const newrecipe = {
      ...newRecipe,
      id: newRecipe.id || Date.now().toString(),
    };

    try {
      if (!user) {
        setRecipes(prevRecipes => [...prevRecipes, newrecipe]);
        return;
      }

      let imageUrl = newRecipe.imageUri;

      if (
        image != undefined &&
        (image.uri.startsWith('file://') || image.uri.startsWith('content://'))
      ) {
        const formData = new FormData();

        formData.append('file', {
          uri: image.uri,
          name: image.fileName,
          type: image.mimeType,
        } as any);

        Alert.alert('Upload', 'Recipe will be uploaded...');

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/upload?user=${user.username}`,
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `${user.access_token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          Alert.alert('Upload failed', errorText);
          return;
        }

        const data = await response.json();

        imageUrl = data.image_url;
      }

      const newrecipeWithServerUrl = {
        ...newrecipe,
        imageUri: imageUrl,
      };

      const recipeResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/recipes?user=${user.username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${user.access_token}`,
          },
          body: JSON.stringify(newrecipeWithServerUrl),
        },
      );

      const recipeData = await recipeResponse.json();

      if (!recipeData.success) {
        Alert.alert('Fehler', `The recipe couldnt be added. ${recipeData.detail || ''}`);
        return;
      }

      setRecipes(prevRecipes => [...prevRecipes, newrecipeWithServerUrl]);
      Alert.alert('Success', 'The recipe was successfully added.');
    } catch {
      Alert.alert('Error', 'The recipe could not be added.');
    }
  };

  const deleteRecipe = (id: string) => {
    if (!user) {
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      return;
    }

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes?id=${id}&user=${user.username}`, {
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
          Alert.alert('Error', 'The recipe could not be deleted.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'The recipe could not be deleted.');
      });
  };

  const checkIfRecipeExists = (id: string) => {
    return recipes.some(recipe => recipe.id === id);
  };

  const clearRecipes = () => {
    setRecipes([]);
    saveRecipesToStorage([]);
  };

  return (
    <RecipeContext.Provider
      value={{
        allrecipes: recipes,
        addRecipe,
        addRecipeLocal,
        deleteRecipe,
        checkIfRecipeExists,
        clearRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
