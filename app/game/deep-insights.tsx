import { BubblyButton } from "@/components/game-components/bubbly-button";
import { FlipCard } from "@/components/game-components/flip-card";
import { GAME_THEME } from "@/constants/game-theme";
import INSIGHTS_DATA from "@/data/deep-insights.json";
import { useInsightStore } from "@/stores/insight-store";
import {
  ArrowRight,
  Heart,
  Languages,
  MapPin,
  Pickaxe,
} from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DeepInsightsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { markAsSeen, addXp, toggleFavorite, favorites } = useInsightStore();

  const currentCard = INSIGHTS_DATA[currentIndex];
  const isLast = currentIndex === INSIGHTS_DATA.length - 1;

  // Determine styles based on category
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "location":
        return {
          color: GAME_THEME.colors.secondary,
          icon: <MapPin color="#FFF" size={24} strokeWidth={3} />,
        };
      case "linguistic":
        return {
          color: GAME_THEME.colors.primary,
          icon: <Languages color="#FFF" size={24} strokeWidth={3} />,
        };
      default:
        return {
          color: GAME_THEME.colors.accent,
          icon: <Pickaxe color="#FFF" size={24} strokeWidth={3} />,
        };
    }
  };

  const theme = getCategoryTheme(currentCard.category);

  const handleNext = () => {
    if (isFlipped) {
      // User learned it
      markAsSeen(currentCard.id);
    }

    setIsFlipped(false);

    // Slight delay to allow flip back animation if needed, or just switch
    setTimeout(() => {
      if (!isLast) setCurrentIndex((prev) => prev + 1);
    }, 150);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentIndex + 1) / INSIGHTS_DATA.length) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.counter}>
          {currentIndex + 1} / {INSIGHTS_DATA.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Did You Know?</Text>

        <FlipCard
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          categoryIcon={theme.icon}
          categoryColor={theme.color}
          frontContent={
            <View>
              <Text style={[styles.categoryText, { color: theme.color }]}>
                {currentCard.category.toUpperCase()}
              </Text>
              <Text style={styles.teaserText}>{currentCard.teaser}</Text>
            </View>
          }
          backContent={
            <View>
              <Text style={styles.titleText}>{currentCard.title}</Text>
              <Text style={styles.factText}>{currentCard.fact}</Text>
              <View style={styles.scriptureBox}>
                <Text style={styles.scriptureText}>
                  {currentCard.scripture}
                </Text>
              </View>
            </View>
          }
        />

        {/* Interaction Area */}
        {isFlipped && (
          <View style={styles.actionRow}>
            <BubblyButton
              title={favorites.includes(currentCard.id) ? "Saved" : "Save"}
              icon={
                <Heart
                  size={20}
                  color="#FFF"
                  fill={
                    favorites.includes(currentCard.id) ? "#FFF" : "transparent"
                  }
                />
              }
              color={GAME_THEME.colors.danger}
              shadowColor={GAME_THEME.colors.dangerShadow}
              onPress={() => toggleFavorite(currentCard.id)}
              style={{ flex: 1, marginRight: 10 }}
            />
            <BubblyButton
              title={isLast ? "Finish" : "Next Insight"}
              icon={<ArrowRight size={20} color="#FFF" />}
              onPress={handleNext}
              style={{ flex: 2 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_THEME.colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: GAME_THEME.colors.primary,
    borderRadius: 10,
  },
  counter: {
    fontFamily: GAME_THEME.fonts.bold,
    color: GAME_THEME.colors.textLight,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 28,
    color: GAME_THEME.colors.text,
    marginBottom: 10,
  },
  // Typography
  categoryText: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  teaserText: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 22,
    textAlign: "center",
    color: GAME_THEME.colors.text,
  },
  titleText: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 20,
    color: GAME_THEME.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  factText: {
    fontFamily: GAME_THEME.fonts.regular,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    lineHeight: 26,
    marginBottom: 20,
  },
  scriptureBox: {
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scriptureText: {
    fontFamily: GAME_THEME.fonts.bold,
    color: GAME_THEME.colors.textLight,
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
});
