import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cardBackground },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: colors.background },
        // cardStyle: { backgroundColor: colors.background }, // Prevent white flash
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="terms" options={{ title: "Terms of Service" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
    </Stack>
  );
}
