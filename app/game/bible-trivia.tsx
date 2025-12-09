import { CustomDialog } from "@/components/common/custom-dialog";
import { BubblyButton } from "@/components/game-components/bubbly-button";
import { GAME_THEME } from "@/constants/game-theme";
import { useGameAudio } from "@/hooks/use-game-audio";
import { useTriviaStore } from "@/stores/trivia-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BibleTriviaScreen() {
  const router = useRouter();
  const { play } = useGameAudio();
  const [exitDialog, setExitDialog] = useState(false);

  const {
    questions,
    currentIndex,
    score,
    lives,
    streak,
    selectedAnswerIndex,
    isCorrect,
    gameOver,
    startTrivia,
    selectAnswer,
    nextQuestion,
  } = useTriviaStore();

  useEffect(() => {
    startTrivia();
  }, []);

  useEffect(() => {
    if (selectedAnswerIndex !== null) {
      if (isCorrect) play("success");
      else play("error");
    }
  }, [selectedAnswerIndex]);

  const currentQ = questions[currentIndex];

  if (!currentQ) return <View style={styles.container} />;

  const handleAnswer = (index: number) => {
    selectAnswer(index);
    if (lives > 1 || (lives === 1 && index === currentQ.correctIndex)) {
      // Auto advance if not game over after short delay
      setTimeout(() => nextQuestion(), 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statPill}>
          <Ionicons name="flame" size={20} color={GAME_THEME.colors.danger} />
          <Text style={styles.statText}>{streak}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreVal}>{Math.floor(score)}</Text>
        </View>
        <View style={styles.statPill}>
          <Ionicons name="heart" size={20} color={GAME_THEME.colors.danger} />
          <Text style={styles.statText}>{lives}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressFill,
            { width: `${(currentIndex / questions.length) * 100}%` },
          ]}
        />
      </View>

      {/* Question Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          entering={ZoomIn.duration(400)}
          key={currentQ.id}
          style={styles.card}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {currentQ.difficulty.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </Animated.View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQ.options.map((opt, index) => {
          let btnColor = GAME_THEME.colors.white;
          let textColor = GAME_THEME.colors.text;

          if (selectedAnswerIndex !== null) {
            if (index === currentQ.correctIndex) {
              btnColor = "#4ADE80"; // Green
              textColor = "#FFF";
            } else if (index === selectedAnswerIndex && !isCorrect) {
              btnColor = "#EF4444"; // Red
              textColor = "#FFF";
            }
          }

          return (
            <Animated.View
              key={`${currentQ.id}-${index}`}
              entering={FadeInDown.delay(index * 100)}
              style={{ marginBottom: 12 }}
            >
              <BubblyButton
                title={opt}
                onPress={() => handleAnswer(index)}
                color={btnColor}
                shadowColor={
                  selectedAnswerIndex !== null && index === selectedAnswerIndex
                    ? undefined
                    : "#E5E5E5"
                }
                textColor={textColor}
                style={{ borderWidth: 1, borderColor: "#EEE" }}
              />
            </Animated.View>
          );
        })}
      </View>

      {/* Footer / Quit */}
      <View style={styles.footer}>
        <BubblyButton
          title="Quit"
          onPress={() => setExitDialog(true)}
          color="transparent"
          shadowColor="transparent"
          textColor="#999"
          style={{ width: 100 }}
        />
      </View>

      {/* Game Over Dialog */}
      <CustomDialog
        visible={gameOver}
        onClose={() => {}}
        title={score > 500 ? "BIBLE SCHOLAR!" : "GAME OVER"}
        showCloseIcon={false}
        actions={[
          { label: "Play Again", onPress: startTrivia, type: "primary" },
          { label: "Exit", onPress: () => router.back(), type: "secondary" },
        ]}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.finalScore}>
            Final Score: {Math.floor(score)}
          </Text>
          <Text
            style={{
              fontFamily: GAME_THEME.fonts.regular,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {score > 500
              ? "You really know the Word!"
              : "Keep studying and try again!"}
          </Text>
        </View>
      </CustomDialog>

      {/* Exit Dialog */}
      <CustomDialog
        visible={exitDialog}
        onClose={() => setExitDialog(false)}
        title="Leave Quiz?"
        actions={[
          {
            label: "Resume",
            onPress: () => setExitDialog(false),
            type: "primary",
          },
          { label: "Leave", onPress: () => router.back(), type: "danger" },
        ]}
      >
        <Text style={{ textAlign: "center" }}>
          Your current progress will be lost.
        </Text>
      </CustomDialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FF", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statPill: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 20,
    gap: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statText: { fontFamily: GAME_THEME.fonts.extraBold, fontSize: 16 },
  scoreBox: { alignItems: "center" },
  scoreLabel: {
    fontSize: 10,
    fontFamily: GAME_THEME.fonts.bold,
    color: "#999",
  },
  scoreVal: {
    fontSize: 24,
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.primary,
  },

  progressContainer: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginBottom: 30,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GAME_THEME.colors.accent,
    borderRadius: 3,
  },

  cardContainer: { flex: 1, justifyContent: "center", marginBottom: 30 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 30,
    borderWidth: 3,
    borderColor: GAME_THEME.colors.primary,
    borderBottomWidth: 6,
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -15,
    backgroundColor: GAME_THEME.colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: { color: "#FFF", fontFamily: GAME_THEME.fonts.bold, fontSize: 12 },
  questionText: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 22,
    textAlign: "center",
    color: GAME_THEME.colors.text,
    lineHeight: 30,
  },

  optionsContainer: { marginBottom: 20 },
  footer: { alignItems: "center" },
  finalScore: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 32,
    color: GAME_THEME.colors.primary,
  },
});
