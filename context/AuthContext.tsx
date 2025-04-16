import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useRecipes } from './RecipeContext';

interface Credentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
  access_token: string;
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
  const [user, setUser] = useState<User | null>(null);
  const { clearRecipes, addRecipeLocal } = useRecipes();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        Alert.alert('Error loading user:');
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const updateUserData = async () => {
      try {
        if (user) {
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
              if (data.recipes) {
                for (const recipe of data.recipes) {
                  console.log('Fetched recipe:', recipe);
                  addRecipeLocal(recipe);
                }
              } else {
                Alert.alert('Error fetching recipes:', data.detail);
              }
            })
            .catch(error => {
              Alert.alert('Error fetching recipes:', error);
            });
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        Alert.alert('Error saving user:');
      }
    };

    updateUserData();
  }, [user]);

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
          Alert.alert('Login failed:', data.detail);
        }
      })
      .catch(error => {
        Alert.alert('Error logging in:', error);
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
          Alert.alert('Registration failed:', data.detail);
        }
      })
      .catch(error => {
        console.error('Error registering:', error);
        // Handle error
        Alert.alert('Error registering');
      });
  };

  const logout = async () => {
    setUser(null);
    clearRecipes();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
