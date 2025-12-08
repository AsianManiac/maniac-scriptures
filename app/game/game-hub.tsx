import { useInsightStore } from "@/stores/insight-store";
import { useRouter } from "expo-router";
import { Book, BookOpen, BrainCircuit, Map } from "lucide-react-native";
import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GAME_THEME } from "../../constants/game-theme";

interface MenuCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
  onPress: any;
  locked?: boolean;
}

// Reusing a simplified card for the menu
const MenuCard = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
  locked = false,
}: MenuCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={[
      styles.menuCard,
      { backgroundColor: color, opacity: locked ? 0.6 : 1 },
    ]}
  >
    <View style={styles.menuIconCircle}>{icon}</View>
    <View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{locked ? "Locked" : subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function GameHubScreen() {
  const router = useRouter();
  const { xp } = useInsightStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>Maniac Quest</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionHeader}>Daily Discoveries</Text>

        {/* The Deep Inside Feature */}
        <MenuCard
          title="Deep Insights"
          subtitle="Locations, Language & Secrets"
          color={GAME_THEME.colors.secondary}
          icon={<BookOpen color={GAME_THEME.colors.secondary} fill="#FFF" />}
          onPress={() => router.push("/game/deep-insights")}
        />

        <Text style={styles.sectionHeader}>Campaign Modes</Text>

        <MenuCard
          title="Bible Trivia"
          subtitle="Test your knowledge"
          color={GAME_THEME.colors.primary}
          icon={<BrainCircuit color={GAME_THEME.colors.primary} />}
          onPress={() => {}} // Connect to quiz logic later
        />

        <MenuCard
          title="Map Explorer"
          subtitle="Find ancient cities (Alpha)"
          color={GAME_THEME.colors.danger}
          icon={<Map color={GAME_THEME.colors.danger} />}
          onPress={() => router.push("/game/map-explorer")} // Connect to expo-maps logic later
        />

        {/* <MenuCard
          title="Falling Word"
          subtitle="Find ancient cities (Alpha)"
          color={GAME_THEME.colors.accent}
          icon={<Map color={GAME_THEME.colors.accent} />}
          onPress={() => router.push("/game/falling-word")} // Connect to expo-maps logic later
        /> */}

        <MenuCard
          title="Verse Ninja"
          subtitle="Find ancient cities (Alpha)"
          color={GAME_THEME.colors.accent}
          icon={<Book color={GAME_THEME.colors.accent} />}
          onPress={() => router.push("/game/verse-ninja")} // Connect to expo-maps logic later
        />

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontFamily: GAME_THEME.fonts.regular, color: "#999" }}>
            More Levels Coming Soon...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_THEME.colors.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: GAME_THEME.colors.border,
  },
  appTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 28,
    fontWeight: "700",
    color: GAME_THEME.colors.primary,
  },
  xpBadge: {
    backgroundColor: GAME_THEME.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: GAME_THEME.colors.accentShadow,
  },
  xpText: {
    fontFamily: GAME_THEME.fonts.bold,
    color: "#FFF",
  },
  scroll: {
    padding: 20,
  },
  sectionHeader: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 18,
    color: GAME_THEME.colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: GAME_THEME.layout.radius.l,
    marginBottom: 16,
    // Bottom border for 3D effect
    borderBottomWidth: 4,
    borderColor: "rgba(0,0,0,0.2)",
  },
  menuIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 18,
    color: "#FFF",
  },
  menuSubtitle: {
    fontFamily: GAME_THEME.fonts.regular,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
});
