import { Tabs, router } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: 'Easy Connect',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <IconSymbol size={28} name="gearshape.fill" color="#007AFF" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="text.bubble.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn-english"
        options={{
          title: 'Learn English',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="graduationcap.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ask-about-uk-life"
        options={{
          title: 'UK Life',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="questionmark.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
