import { BubblyButton } from "@/components/game-components/bubbly-button";
import { GAME_THEME } from "@/constants/game-theme";
import { CAMPAIGN_DATA } from "@/data/campaign-data";
import { useCampaignStore } from "@/stores/campaign-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CampaignStagesScreen() {
  const router = useRouter();
  const { isStageUnlocked, getStageProgress, getTotalStarsForStage } =
    useCampaignStore();

  const handleStagePress = (stageId: string) => {
    if (isStageUnlocked(stageId)) {
      router.push({
        pathname: "/game/campaign/map",
        params: { stageId },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={GAME_THEME.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHRONICLES</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Select an Era</Text>

        {CAMPAIGN_DATA.map((stage, index) => {
          const unlocked = isStageUnlocked(stage.id);
          const progress = getStageProgress(stage.id);
          const stars = getTotalStarsForStage(stage.id);
          const totalLevels = stage.levels.length;

          return (
            <Animated.View
              key={stage.id}
              entering={FadeInRight.delay(index * 100)}
              style={[styles.card, !unlocked && styles.lockedCard]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleStagePress(stage.id)}
                disabled={!unlocked}
              >
                {/* Stage Image Header */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: stage.imageUrl }}
                    style={styles.stageImage}
                  />
                  <View style={styles.imageOverlay} />

                  {unlocked ? (
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderText}>{stage.order}</Text>
                    </View>
                  ) : (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={32} color="#FFF" />
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.row}>
                    <Text style={styles.stageTitle}>{stage.title}</Text>
                    {unlocked && (
                      <View style={styles.starsPill}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.starsText}>
                          {stars}/{totalLevels * 3}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.stageDesc}>{stage.description}</Text>

                  {unlocked && (
                    <View style={styles.progressContainer}>
                      <View style={styles.track}>
                        <View
                          style={[styles.fill, { width: `${progress}%` }]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round(progress)}% Complete
                      </Text>
                    </View>
                  )}

                  {!unlocked && (
                    <Text style={styles.lockedText}>
                      Complete previous stage to unlock
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Reset Button for Testing */}
        <View style={{ marginTop: 20 }}>
          <BubblyButton
            title="Reset Progress"
            onPress={() => useCampaignStore.getState().resetCampaign()}
            color={GAME_THEME.colors.danger}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  backBtn: { padding: 5 },
  headerTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 24,
    color: GAME_THEME.colors.primary,
  },
  scroll: { padding: 20 },
  subtitle: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 18,
    color: "#999",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  lockedCard: { opacity: 0.8 },
  imageContainer: { height: 120, width: "100%", backgroundColor: "#EEE" },
  stageImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  orderBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GAME_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  orderText: { color: "#FFF", fontFamily: GAME_THEME.fonts.extraBold },

  cardContent: { padding: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  stageTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 20,
    color: GAME_THEME.colors.text,
  },
  starsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9C4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  starsText: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 12,
    color: "#F57F17",
  },
  stageDesc: {
    fontFamily: GAME_THEME.fonts.regular,
    color: "#666",
    marginBottom: 15,
  },

  progressContainer: { marginTop: 5 },
  track: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginBottom: 5,
  },
  fill: {
    height: "100%",
    backgroundColor: GAME_THEME.colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 10,
    color: "#999",
    textAlign: "right",
  },
  lockedText: {
    fontFamily: GAME_THEME.fonts.bold,
    color: "#999",
    fontStyle: "italic",
  },
});
