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
        name="falling-word"
        options={{ headerShown: false, ...Transition.presets.ZoomIn() }}
      />
      <Stack.Screen
        name="bible-trivia"
        options={{ headerShown: false, ...Transition.presets.SlideFromTop() }}
      />

      {/* Campaign Routes */}
      <Stack.Screen
        name="campaign/map"
        options={{
          ...Transition.presets.SlideFromBottom(),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="campaign/play"
        options={{
          ...Transition.presets.ZoomIn(),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="campaign/stages"
        options={{
          ...Transition.presets.ZoomIn(),
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
