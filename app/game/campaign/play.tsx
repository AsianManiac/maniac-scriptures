import { BubblyButton } from "@/components/game-components/bubbly-button";
import { GAME_THEME } from "@/constants/game-theme";
import { CAMPAIGN_DATA } from "@/data/campaign-data";
import { useGameAudio } from "@/hooks/use-game-audio";
import { useCampaignStore } from "@/stores/campaign-store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- SUB-COMPONENTS FOR GAME TYPES ---

// 1. QUIZ VIEW
const QuizView = ({
  data,
  onAnswer,
}: {
  data: string[];
  onAnswer: (ans: string) => void;
}) => (
  <View style={styles.optionsContainer}>
    {data.map((opt, i) => (
      <Animated.View key={i} entering={FadeInDown.delay(i * 100)}>
        <BubblyButton
          title={opt}
          onPress={() => onAnswer(opt)}
          style={{ marginBottom: 12 }}
          color="#FFF"
          textColor={GAME_THEME.colors.text}
        />
      </Animated.View>
    ))}
  </View>
);

// 2. ORDER VIEW (Tap to move words to slot)
const OrderView = ({
  data,
  onFinish,
}: {
  data: string[];
  onFinish: (ans: string[]) => void;
}) => {
  const [available, setAvailable] = useState<{ id: number; text: string }[]>(
    data.map((t, i) => ({ id: i, text: t })).sort(() => Math.random() - 0.5)
  );
  const [selected, setSelected] = useState<{ id: number; text: string }[]>([]);

  const toggle = (item: { id: number; text: string }, isSelecting: boolean) => {
    if (isSelecting) {
      setAvailable((p) => p.filter((i) => i.id !== item.id));
      setSelected((p) => [...p, item]);
    } else {
      setSelected((p) => p.filter((i) => i.id !== item.id));
      setAvailable((p) => [...p, item]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Answer Slots */}
      <View style={styles.orderSlotContainer}>
        {selected.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggle(item, false)}
            style={styles.orderPillSelected}
          >
            <Text style={styles.orderTextSelected}>{item.text}</Text>
          </TouchableOpacity>
        ))}
        {selected.length === 0 && (
          <Text style={styles.hintText}>Tap words below to order them</Text>
        )}
      </View>

      {/* Word Bank */}
      <View style={styles.orderBank}>
        {available.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggle(item, true)}
            style={styles.orderPill}
          >
            <Text style={styles.orderText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: "auto" }}>
        <BubblyButton
          title="CONFIRM ORDER"
          onPress={() => onFinish(selected.map((s) => s.text))}
          color={
            selected.length === data.length ? GAME_THEME.colors.primary : "#CCC"
          }
        />
      </View>
    </View>
  );
};

// 3. FILL BLANK VIEW
const FillBlankView = ({
  question,
  data,
  onAnswer,
}: {
  question: string;
  data: string[];
  onAnswer: (ans: string) => void;
}) => {
  const parts = question.split("___");
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.fillSentence}>
        {parts[0]}
        <Text
          style={{
            color: GAME_THEME.colors.accent,
            textDecorationLine: "underline",
          }}
        >
          {" "}
          ???{" "}
        </Text>
        {parts[1]}
      </Text>
      <View style={styles.optionsContainer}>
        {data.map((opt, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 100)}>
            <BubblyButton
              title={opt}
              onPress={() => onAnswer(opt)}
              style={{ marginBottom: 12 }}
              color="#FFF"
              textColor={GAME_THEME.colors.text}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// 4. NEW: MATCHING VIEW
const MatchingView = ({
  data,
  correctAnswer,
  onFinish,
}: {
  data: string[];
  correctAnswer: string | string[];
  onFinish: (ans: string[]) => void;
}) => {
  // Parse correct pairs from "Key:Value" string array
  // Example correctAnswer: ["Adam:First Man", "Eve:First Woman"]
  // Example data: ["Adam", "First Man", "Eve", "First Woman"] (Mixed)

  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]); // Array of matched items
  const [wrongShake, setWrongShake] = useState<string | null>(null);

  const handleTap = (item: string) => {
    if (matches.includes(item)) return;

    if (!selected) {
      setSelected(item);
    } else {
      if (selected === item) {
        setSelected(null); // Deselect
        return;
      }

      // Check match
      const isMatch = checkPair(selected, item);
      if (isMatch) {
        setMatches((prev) => [...prev, selected, item]);
        setSelected(null);

        // Check win condition immediately
        if (matches.length + 2 >= data.length) {
          onFinish(correctAnswer as string[]); // Pass complete dummy, logic handled in parent
        }
      } else {
        // Wrong
        setWrongShake(item); // Visual feedback trigger
        setTimeout(() => {
          setWrongShake(null);
          setSelected(null);
        }, 500);
      }
    }
  };

  const checkPair = (a: string, b: string) => {
    const pairs = Array.isArray(correctAnswer)
      ? correctAnswer
      : [correctAnswer];
    return pairs.some((pair) => {
      const [p1, p2] = pair.split(":");
      return (p1 === a && p2 === b) || (p1 === b && p2 === a);
    });
  };

  return (
    <View style={styles.matchingContainer}>
      <Text style={styles.hintText}>Tap matching pairs</Text>
      <View style={styles.grid}>
        {data.map((item, i) => {
          const isMatched = matches.includes(item);
          const isSelected = selected === item;
          const isWrong =
            wrongShake === item || (wrongShake && selected === item);

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleTap(item)}
              style={[
                styles.matchCard,
                isSelected && styles.matchCardSelected,
                isMatched && styles.matchCardDone,
                isWrong && styles.matchCardWrong,
              ]}
              disabled={isMatched}
            >
              <Text
                style={[
                  styles.matchText,
                  (isSelected || isMatched) && { color: "#FFF" },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---

export default function CampaignPlayScreen() {
  const { levelId, stageId } = useLocalSearchParams();
  const router = useRouter();
  const { play } = useGameAudio();
  const { completeLevel } = useCampaignStore();

  const stage = CAMPAIGN_DATA.find((s) => s.id === stageId);
  const level = stage?.levels.find((l) => l.id === levelId);

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "result">("playing");
  const [resultData, setResultData] = useState<{
    stars: number;
    newPiece: boolean;
    stageUnlocked: boolean;
  } | null>(null);

  if (!level) return null;

  const currentChallenge = level.challenges[challengeIdx];
  const progress = (challengeIdx / level.challenges.length) * 100;

  const handleChallengeComplete = (userAnswer: any) => {
    let isCorrect = false;
    if (
      currentChallenge.type === "order" &&
      Array.isArray(currentChallenge.correctAnswer)
    ) {
      isCorrect =
        JSON.stringify(userAnswer) ===
        JSON.stringify(currentChallenge.correctAnswer);
    } else if (currentChallenge.type === "matching") {
      isCorrect = true;
    } else {
      isCorrect = userAnswer === currentChallenge.correctAnswer;
    }

    if (isCorrect) {
      play("success");
      setScore((s) => s + 1);
    } else {
      play("error");
    }

    setTimeout(() => {
      if (challengeIdx < level.challenges.length - 1) {
        setChallengeIdx((i) => i + 1);
      } else {
        finishLevel(isCorrect ? score + 1 : score);
      }
    }, 800);
  };

  const finishLevel = (finalScore: number) => {
    setScore(finalScore);
    setGameState("result");

    // Calculate percentage
    const percentage = (finalScore / level.challenges.length) * 100;
    completeLevel(stageId as string, levelId as string, percentage);

    if (percentage > 50) play("success"); // Big success sound if available

    // Call store
    const result = completeLevel(
      stageId as string,
      levelId as string,
      percentage
    );

    setResultData(result);
    setScore(finalScore);
    setGameState("result");

    if (result.stars >= 2) play("success");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {gameState === "playing" ? (
        <ScrollView contentContainerStyle={styles.content}>
          {/* QUESTION CARD */}
          <Animated.View
            key={currentChallenge.id}
            entering={ZoomIn}
            style={styles.card}
          >
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {currentChallenge.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.questionText}>
              {currentChallenge.type === "fill-blank"
                ? "Complete the verse:"
                : currentChallenge.question}
            </Text>
            {currentChallenge.verseReference && (
              <Text style={styles.refText}>
                {currentChallenge.verseReference}
              </Text>
            )}
          </Animated.View>

          {/* INTERACTIVE AREA */}
          <View style={styles.interactiveArea}>
            {currentChallenge.type === "quiz" && (
              <QuizView
                data={currentChallenge.data}
                onAnswer={handleChallengeComplete}
              />
            )}
            {currentChallenge.type === "fill-blank" && (
              <FillBlankView
                question={currentChallenge.question}
                data={currentChallenge.data}
                onAnswer={handleChallengeComplete}
              />
            )}
            {currentChallenge.type === "order" && (
              <OrderView
                data={currentChallenge.data}
                onFinish={handleChallengeComplete}
              />
            )}
            {currentChallenge.type === "matching" && (
              <MatchingView
                data={currentChallenge.data}
                correctAnswer={currentChallenge.correctAnswer}
                onFinish={handleChallengeComplete}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        // RESULT SCREEN
        <View style={styles.resultContainer}>
          <Animated.View entering={ZoomIn} style={{ alignItems: "center" }}>
            <Ionicons
              name="trophy"
              size={80}
              color={GAME_THEME.colors.accent}
            />
            <Text style={styles.resultTitle}>LEVEL COMPLETE</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3].map((i) => {
                const earned = (score / level.challenges.length) * 3 >= i;
                return (
                  <Ionicons
                    key={i}
                    name="star"
                    size={40}
                    color={
                      i <= (resultData?.stars || 0) ? "#FFD700" : "#E0E0E0"
                    }
                  />
                );
              })}
            </View>

            <Text style={styles.scoreText}>
              {score} / {level.challenges.length} Correct
            </Text>

            {resultData?.newPiece && (
              <View style={styles.rewardBadge}>
                <Ionicons name="extension-puzzle" size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  RELIC PIECE FOUND!
                </Text>
              </View>
            )}

            {resultData?.stageUnlocked && (
              <View
                style={[styles.rewardBadge, { backgroundColor: "#9C27B0" }]}
              >
                <Ionicons name="lock-open" size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  NEW STAGE UNLOCKED!
                </Text>
              </View>
            )}

            <View style={{ marginTop: 40, width: 200 }}>
              <BubblyButton title="CONTINUE" onPress={() => router.back()} />
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  header: { padding: 20, flexDirection: "row", alignItems: "center", gap: 15 },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: GAME_THEME.colors.primary },
  closeBtn: { padding: 5 },

  content: { padding: 20, flexGrow: 1 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  typeBadge: {
    position: "absolute",
    top: -12,
    backgroundColor: GAME_THEME.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: { color: "#FFF", fontFamily: GAME_THEME.fonts.bold, fontSize: 10 },
  questionText: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 20,
    textAlign: "center",
    color: GAME_THEME.colors.text,
    marginBottom: 10,
  },
  refText: { fontFamily: GAME_THEME.fonts.italic, color: "#999", fontSize: 14 },

  interactiveArea: { flex: 1 },
  optionsContainer: { gap: 10 },

  // Order Game Styles
  orderSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 60,
    backgroundColor: "#E8E8E8",
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  orderPillSelected: {
    backgroundColor: GAME_THEME.colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderTextSelected: { color: "#FFF", fontFamily: GAME_THEME.fonts.bold },
  orderBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  orderPill: {
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  orderText: {
    color: GAME_THEME.colors.text,
    fontFamily: GAME_THEME.fonts.bold,
  },
  hintText: { color: "#AAA", fontFamily: GAME_THEME.fonts.regular },

  // Fill Blank Styles
  fillSentence: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 32,
    color: GAME_THEME.colors.text,
  },

  // Result
  resultContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  resultTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 28,
    color: GAME_THEME.colors.text,
    marginVertical: 20,
  },
  starsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  scoreText: { fontFamily: GAME_THEME.fonts.bold, fontSize: 18, color: "#666" },

  rewardBadge: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GAME_THEME.colors.primary,
    padding: 10,
    borderRadius: 12,
  },

  // Matching Styles
  matchingContainer: { flex: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  matchCard: {
    width: "45%",
    height: 80,
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 2,
    borderColor: "#EEE",
    elevation: 2,
  },
  matchCardSelected: {
    backgroundColor: GAME_THEME.colors.primary,
    borderColor: GAME_THEME.colors.primary,
  },
  matchCardDone: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    opacity: 0.5,
  },
  matchCardWrong: { backgroundColor: "#F44336", borderColor: "#F44336" },
  matchText: {
    fontFamily: GAME_THEME.fonts.bold,
    textAlign: "center",
    color: GAME_THEME.colors.text,
  },
});
