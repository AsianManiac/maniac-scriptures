import Colors from "@/constants/colors";
import { useBibleStore } from "@/stores/bible-store";

export function useTheme() {
  const { settings } = useBibleStore();
  const isDark = settings.theme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return {
    colors,
    isDark,
    theme: settings.theme,
  };
}
