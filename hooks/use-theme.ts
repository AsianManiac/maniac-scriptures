import Colors from "@/constants/colors";
import { useBibleStore } from "@/stores/bible-store";
import { useColorScheme } from "react-native";

export function useTheme() {
  const { settings } = useBibleStore();
  const systemScheme = useColorScheme(); // Detect system
  const effectiveTheme =
    settings.theme === "system" ? systemScheme : settings.theme;
  const isDark = effectiveTheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return {
    colors,
    isDark,
    theme: settings.theme,
  };
}
