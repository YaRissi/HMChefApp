import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, User } from './AuthContext';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
  } catch (error) {
    console.error('Fehler beim Speichern der Rezepte:', error);
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
    } else {
      const response = await fetch(`${process.env.API_URL}/api/recipes?user=${user.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${user.access_token}`,
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
        console.log('User not logged in, adding recipe locally');
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
          console.error('Upload failed:', errorText);
          throw new Error(`Upload failed: ${response.status}`);
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
      console.log('Response:', recipeData);

      if (!recipeData.success) {
        Alert.alert('Fehler', `The recipe couldnt be added. ${recipeData.detail || ''}`);
        return;
      }
      console.log('Adding recipe:', newrecipeWithServerUrl);

      setRecipes(prevRecipes => [...prevRecipes, newrecipeWithServerUrl]);
      console.log('Rezept erfolgreich hinzugefügt:', recipeData);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Rezepts:', error);
      Alert.alert('Fehler', 'Das Rezept konnte nicht hinzugefügt werden.');
    }
  };

  const deleteRecipe = (id: string) => {
    if (user) {
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
    try {
    } catch (error) {}
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
