import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { RecipeProvider } from '@/context/RecipeContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <RecipeProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            headerTitle: 'Home',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }: { color: string }) => (
              <AntDesign name="home" size={24} color={color} style={RootStyles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="New Recipe"
          options={{
            headerTitle: 'New Recipe',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }: { color: string }) => (
              <Entypo name="new-message" size={24} color={color} style={RootStyles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="My Recipes"
          options={{
            headerTitle: 'My Recipe',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }: { color: string }) => (
              <Entypo name="list" size={24} color={color} style={RootStyles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            headerTitle: 'Search Recipe',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }: { color: string }) => (
              <AntDesign name="search1" size={24} color={color} style={RootStyles.icon} />
            ),
          }}
        />
      </Tabs>
    </RecipeProvider>
  );
}

export const RootStyles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
