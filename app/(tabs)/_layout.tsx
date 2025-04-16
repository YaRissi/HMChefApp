import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export default function LoggedInTabs() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const showRecipes = user || process.env.EXPO_PUBLIC_WITHOUT_SYNC;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerTitleAlign: 'center',
        tabBarLabelStyle: { fontSize: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign name="home" size={24} color={color} style={RootStyles.icon} />
          ),
        }}
      />
      <Tabs.Screen
        name="New Recipe"
        options={{
          title: 'New Recipe',
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name="new-message" size={24} color={color} style={RootStyles.icon} />
          ),
          href: showRecipes ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="My Recipes"
        options={{
          title: 'My Recipes',
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name="list" size={24} color={color} style={RootStyles.icon} />
          ),
          href: showRecipes ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search Recipe',
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign name="search1" size={24} color={color} style={RootStyles.icon} />
          ),
          href: showRecipes ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign name="setting" size={24} color={color} style={RootStyles.icon} />
          ),
        }}
      />
    </Tabs>
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
