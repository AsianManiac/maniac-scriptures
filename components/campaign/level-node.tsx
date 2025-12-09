import { GAME_THEME } from "@/constants/game-theme";
import { CampaignLevel } from "@/types/campaign";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  level: CampaignLevel;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  onPress: () => void;
  index: number; // For styling zig-zag
}

export const LevelNode = ({
  level,
  isUnlocked,
  isCompleted,
  stars,
  onPress,
  index,
}: Props) => {
  // Zig-Zag layout logic: Even indices left, Odd right
  const alignSelf = index % 2 === 0 ? "flex-start" : "flex-end";
  const marginLeft = index % 2 === 0 ? 40 : 0;
  const marginRight = index % 2 !== 0 ? 40 : 0;

  return (
    <View style={[styles.container, { alignSelf, marginLeft, marginRight }]}>
      {/* Connector Line (Virtual) is handled by parent or simple absolute view behind */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={isUnlocked ? onPress : undefined}
        style={[
          styles.node,
          !isUnlocked && styles.lockedNode,
          isCompleted && styles.completedNode,
        ]}
      >
        {isUnlocked ? (
          <Text style={[styles.levelNum, isCompleted && { color: "#FFF" }]}>
            {index + 1}
          </Text>
        ) : (
          <Ionicons name="lock-closed" size={20} color="#AAA" />
        )}
      </TouchableOpacity>

      {/* Stars Display */}
      {isCompleted && (
        <View style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <Ionicons
              key={s}
              name="star"
              size={12}
              color={s <= stars ? "#FFD700" : "#E0E0E0"}
            />
          ))}
        </View>
      )}

      <Text style={styles.title}>{level.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
    width: 120,
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    borderWidth: 4,
    borderColor: GAME_THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 5,
    zIndex: 2,
  },
  lockedNode: {
    backgroundColor: "#F0F0F0",
    borderColor: "#CCC",
  },
  completedNode: {
    backgroundColor: GAME_THEME.colors.primary,
    borderColor: "#2E8B57", // Darker green
  },
  levelNum: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 24,
    color: GAME_THEME.colors.primary,
  },
  starsRow: {
    flexDirection: "row",
    marginTop: 5,
    gap: 2,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 4,
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    marginTop: 5,
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 12,
    color: GAME_THEME.colors.textLight,
  },
});
