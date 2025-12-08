import { NinjaWord } from "@/components/game-components/ninja-word";
import { GAME_THEME } from "@/constants/game-theme";
import { useGameAudio } from "@/hooks/use-game-audio";
import { useNinjaStore } from "@/stores/ninja-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerseNinjaScreen() {
  const { play } = useGameAudio();
  const {
    startGame,
    spawnWord,
    activeWords,
    handleSlice,
    handleMiss,
    score,
    hearts,
    targetVerse,
    nextIndex,
  } = useNinjaStore();

  useEffect(() => {
    startGame("For God so loved the world that He gave His only Son");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hearts > 0 && nextIndex < targetVerse.length) {
        spawnWord();
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [hearts, nextIndex]);

  const onWordAction = (id: string, text: string) => {
    const isCorrect = handleSlice(id, text);
    if (isCorrect) play("slice");
    else play("error");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreVal}>{score}</Text>
        </View>
        <View style={styles.hearts}>
          {[1, 2, 3].map((i) => (
            <Ionicons
              key={i}
              name={i <= hearts ? "heart" : "heart-outline"}
              size={32}
              color={GAME_THEME.colors.danger}
            />
          ))}
        </View>
      </SafeAreaView>

      {/* Lanes Background */}
      <View style={styles.lanes}>
        <View style={styles.lane} />
        <View style={styles.lane} />
        <View style={styles.lane} />
      </View>

      {/* Game Loop */}
      {activeWords.map((w) => (
        <NinjaWord
          key={w.id}
          id={w.id}
          word={w.text}
          lane={w.lane}
          speed={3000} // ms to fall
          onSlice={() => onWordAction(w.id, w.text)}
          onMiss={() => handleMiss(w.id)}
        />
      ))}

      {/* Verse Progress at Bottom */}
      <View style={styles.footer}>
        <Text style={styles.verseText}>
          <Text style={{ color: GAME_THEME.colors.primary }}>
            {targetVerse.slice(0, nextIndex).join(" ")}{" "}
          </Text>
          <Text style={{ color: "#CCC" }}>
            {targetVerse.slice(nextIndex).join(" ")}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  statBox: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eee",
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: GAME_THEME.fonts.bold,
    color: "#999",
  },
  scoreVal: {
    fontSize: 24,
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.accent,
  },
  hearts: { flexDirection: "row", gap: 5 },

  lanes: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    zIndex: -1,
  },
  lane: { flex: 1, borderRightWidth: 1, borderColor: "rgba(0,0,0,0.05)" },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderBottomWidth: 5,
    borderColor: "#eee",
    alignItems: "center",
  },
  verseText: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 18,
    textAlign: "center",
  },
});
