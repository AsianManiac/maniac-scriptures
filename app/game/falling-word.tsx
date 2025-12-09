import { CustomDialog } from "@/components/common/custom-dialog";
import { BubblyButton } from "@/components/game-components/bubbly-button";
import { FallingWordItem } from "@/components/game-components/falling-word-item";
import { GAME_THEME } from "@/constants/game-theme";
import { useGameAudio } from "@/hooks/use-game-audio";
import { useFallingWordStore } from "@/stores/falling-word-store";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FallingWordScreen() {
  const router = useRouter();
  const { play } = useGameAudio();
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // Countdown State
  const [countdown, setCountdown] = useState(5);

  const {
    status,
    activeWords,
    targetVerseText,
    targetReference,
    shownHintIndex,
    nextWordIndex,
    score,
    highScore,
    lives,
    speedMultiplier,
    setSpeed,
    startGameSetup,
    startPlaying,
    spawnTick,
    handleSelectWord,
    handleMissedWord,
    pauseGame,
    resumeGame,
    quitGame,
  } = useFallingWordStore();

  useEffect(() => {
    startGameSetup();
    return () => quitGame();
  }, []);

  // Handle Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "countdown") {
      setCountdown(5); // Reset
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startPlaying();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Game Loop - Optimized Speed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "playing") {
      // Base interval 800ms, reduced by speed multiplier
      // If speed is 2x, interval is 400ms (very fast)
      // Gap calculation: To reduce gap, we spawn more frequently.
      const spawnRate = Math.max(300, 800 / speedMultiplier);

      interval = setInterval(() => {
        spawnTick();
      }, spawnRate);
    }
    return () => clearInterval(interval);
  }, [status, speedMultiplier]);

  useEffect(() => {
    if (status === "lost") play("pop");
    else if (status === "won") play("success");
  }, [status]);

  const onSelect = (id: string, text: string, isCorrect: boolean) => {
    const result = handleSelectWord(id, text, isCorrect);
    if (result.correct) play("success");
    else play("error");
  };

  const onMiss = (id: string, isCorrect: boolean) => {
    handleMissedWord(id, isCorrect);
    if (isCorrect) play("error");
  };

  const handlePause = () => {
    pauseGame();
    setShowPauseMenu(true);
  };

  const handleResume = () => {
    setShowPauseMenu(false);
    resumeGame();
  };

  const handleRestart = () => {
    setShowPauseMenu(false);
    startGameSetup();
  };

  const handleExit = () => {
    quitGame();
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={handlePause} style={styles.iconBtn}>
            <Ionicons name="pause" size={24} color={GAME_THEME.colors.text} />
          </TouchableOpacity>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>SCORE (HI: {highScore})</Text>
            <Text style={styles.scoreVal}>{score}</Text>
          </View>

          <View style={styles.hearts}>
            {[1, 2, 3].map((i) => (
              <Ionicons
                key={i}
                name="heart"
                size={28}
                color={i <= lives ? GAME_THEME.colors.danger : "#E0E0E0"}
              />
            ))}
          </View>
        </View>

        <View style={styles.verseBox}>
          <Text style={styles.refText}>{targetReference} (KJV)</Text>
          <Text style={styles.verseText}>
            {targetVerseText.map((word, index) => {
              const isHint = index < shownHintIndex;
              const isCollected =
                index >= shownHintIndex && index < nextWordIndex;
              if (isHint)
                return (
                  <Text key={index} style={styles.textHint}>
                    {word}{" "}
                  </Text>
                );
              if (isCollected)
                return (
                  <Text key={index} style={styles.textCollected}>
                    {word}{" "}
                  </Text>
                );
              return (
                <Text key={index} style={styles.textHidden}>
                  ___{" "}
                </Text>
              );
            })}
          </Text>
        </View>
      </SafeAreaView>

      <View style={styles.gameArea}>
        <View style={styles.lanes}>
          <View style={styles.lane} />
          <View style={styles.lane} />
          <View style={[styles.lane, { borderRightWidth: 0 }]} />
        </View>

        {activeWords.map((w) => (
          <FallingWordItem
            key={w.id}
            id={w.id}
            text={w.text}
            lane={w.lane}
            isCorrect={w.isCorrect}
            paused={status !== "playing"}
            // Pass speed multiplier to speed up CSS animation
            // Base duration 4000ms / multiplier
            fallDuration={4000 / speedMultiplier}
            onSelect={() => onSelect(w.id, w.text, w.isCorrect)}
            onMiss={() => onMiss(w.id, w.isCorrect)}
          />
        ))}
      </View>

      {/* --- PRE-START DIALOG --- */}
      <CustomDialog
        visible={status === "countdown"}
        onClose={() => {}}
        title="GET READY"
        showCloseIcon={false}
        closeOnOutsideClick={false}
      >
        <View style={{ alignItems: "center", padding: 10 }}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.refText}>{targetReference}</Text>
          <Text
            style={[
              styles.verseText,
              { textAlign: "center", color: "#666", marginBottom: 20 },
            ]}
          >
            "{targetVerseText.slice(0, shownHintIndex).join(" ")}..."
          </Text>

          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text style={styles.speedLabel}>
              Fall Speed: {speedMultiplier}x
            </Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={3}
              step={0.5}
              value={speedMultiplier}
              onSlidingComplete={setSpeed}
              minimumTrackTintColor={GAME_THEME.colors.primary}
              maximumTrackTintColor="#000000"
              thumbTintColor={GAME_THEME.colors.primary}
            />
          </View>

          <BubblyButton
            title="START NOW"
            onPress={startPlaying}
            color="rgba(0,0,0,0.05)"
            shadowColor="transparent"
            textColor={GAME_THEME.colors.primary}
            style={{ width: "100%" }}
          />
        </View>
      </CustomDialog>

      {/* PAUSE MENU */}
      <CustomDialog
        visible={showPauseMenu}
        onClose={handleResume}
        title="PAUSED"
        actions={[
          { label: "Resume", onPress: handleResume, type: "primary" },
          { label: "Restart", onPress: handleRestart, type: "secondary" },
          { label: "Exit", onPress: handleExit, type: "danger" },
        ]}
      />

      {/* GAME OVER / WIN */}
      <CustomDialog
        visible={status === "lost" || status === "won"}
        onClose={() => {}}
        title={status === "won" ? "COMPLETED!" : "GAME OVER"}
        showCloseIcon={false}
        closeOnOutsideClick={false}
        actions={[
          { label: "Play Again", onPress: handleRestart, type: "primary" },
          { label: "Menu", onPress: handleExit, type: "secondary" },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Ionicons
            name={status === "won" ? "star" : "sad-outline"}
            size={50}
            color={GAME_THEME.colors.primary}
          />
          <Text style={styles.finalScore}>Score: {score}</Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              color: "#555",
              fontFamily: GAME_THEME.fonts.regular,
            }}
          >
            {targetVerseText.join(" ")}
          </Text>
        </View>
      </CustomDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  iconBtn: { padding: 8, backgroundColor: "#F0F0F0", borderRadius: 12 },
  scoreContainer: { alignItems: "center" },
  scoreTitle: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 10,
    color: "#999",
  },
  scoreVal: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 24,
    color: GAME_THEME.colors.primary,
  },
  hearts: { flexDirection: "row", gap: 5 },

  verseBox: {
    backgroundColor: "#F8F9FF",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0FF",
  },
  refText: {
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.accent,
    marginBottom: 5,
  },
  verseText: { flexDirection: "row", flexWrap: "wrap" },
  textHint: { fontFamily: GAME_THEME.fonts.bold, color: "#999" },
  textCollected: {
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.primary,
  },
  textHidden: { fontFamily: GAME_THEME.fonts.regular, color: "#DDD" },

  gameArea: { flex: 1, overflow: "hidden" },
  lanes: { ...StyleSheet.absoluteFillObject, flexDirection: "row" },
  lane: { flex: 1, borderRightWidth: 1, borderColor: "rgba(0,0,0,0.03)" },

  countdownText: {
    fontSize: 60,
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.primary,
    marginBottom: 10,
  },
  speedLabel: {
    fontFamily: GAME_THEME.fonts.bold,
    color: "#666",
    marginBottom: 5,
  },
  finalScore: {
    fontSize: 24,
    fontFamily: GAME_THEME.fonts.extraBold,
    marginTop: 10,
  },
});
