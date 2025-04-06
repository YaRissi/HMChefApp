import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <AntDesign name="home" size={24} color={color} style={{ marginBottom: -3 }}/>,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: 'New Recipe',
          tabBarIcon: ({ color }: { color: string }) => <Entypo name="new-message" size={24} color={color} style={{ marginBottom: -3 }}/>,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'My Recipe',
          tabBarIcon: ({ color }: { color: string }) => <Entypo name="list" size={24} color={color} style={{ marginBottom: -3 }}/>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search Recipe',
          tabBarIcon: ({ color }: { color: string }) => <AntDesign name="search1" size={24} color={color} style={{ marginBottom: -3 }}/>,
        }}
      />
    </Tabs>
  );
}
