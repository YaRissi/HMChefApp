import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Recipe, useRecipes } from './RecipeContext';
import { useAuthState, User } from './AuthState';

interface Credentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => void;
  register: (credentials: Credentials) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'current_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuthState();
  const { clearRecipes, addRecipeLocal } = useRecipes();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    loadUser();
  }, [setUser]);

  useEffect(() => {
    const updateUserData = async () => {
      try {
        if (!user) {
          await AsyncStorage.removeItem(STORAGE_KEY);
          return;
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/recipes?user=${user.username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${user.access_token}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            for (const recipe of data.recipes) {
              const recipeData = {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                category: recipe.category,
                imageUri: recipe.imageUri,
              } as Recipe;
              addRecipeLocal(recipeData);
            }
          })
          .catch(() => {
            Alert.alert('Error', 'Failed to fetch recipes.');
          });
      } catch {
        Alert.alert('Error', 'Failed to update user data.');
      }
    };

    updateUserData();
  }, [user, addRecipeLocal]);

  const login = async (credentials: Credentials) => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
      }).toString(),
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          const userData: User = {
            username: credentials.username,
            access_token: data.access_token,
          };

          setUser(userData);
        } else {
          Alert.alert('Login Error', data.detail || 'Please check your login credentials');
        }
      })
      .catch(() => {
        Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      });
  };

  const register = async (credentials: Credentials) => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
      }).toString(),
    })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          const userData: User = {
            username: credentials.username,
            access_token: data.access_token,
          };

          setUser(userData);
        } else {
          Alert.alert(
            'Registration Error',
            data.detail || 'The registration could not be completed.',
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Registration Error',
          'An error occurred during registration. Please try again.',
        );
      });
  };

  const logout = async () => {
    clearRecipes();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
