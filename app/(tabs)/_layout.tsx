import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { FileText, Heart, Home, Star } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600" as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(devotionals)"
        options={{
          title: "Devotionals",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="(notes)"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(favorites)"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Star color={color} size={size} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
