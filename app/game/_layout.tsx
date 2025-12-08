import { Stack } from "@/components/Stack";
import Colors from "@/constants/colors";
import Transition from "react-native-screen-transitions";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTintColor: Colors.light.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="deep-insights"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="game-hub"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="map-explorer"
        options={{
          headerShown: false,
          ...Transition.presets.ZoomIn(),
        }}
      />
      <Stack.Screen
        name="verse-ninja"
        options={{
          headerShown: false,
          ...Transition.presets.ZoomIn(),
        }}
      />
    </Stack>
  );
}
