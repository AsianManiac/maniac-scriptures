import { LevelNode } from "@/components/campaign/level-node";
import { PuzzleGrid } from "@/components/campaign/puzzle-grid";
import { CustomDialog } from "@/components/common/custom-dialog";
import { BubblyButton } from "@/components/game-components/bubbly-button";
import { GAME_THEME } from "@/constants/game-theme";
import { CAMPAIGN_DATA } from "@/data/campaign-data";
import { useCampaignStore } from "@/stores/campaign-store";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const NODE_HEIGHT = 100;

export default function CampaignMapScreen() {
  const router = useRouter();
  const { stageId } = useLocalSearchParams();
  const {
    unlockedLevelIds,
    completedLevelIds,
    levelStars,
    stagePieces,
    relicsRestored,
    unlockRelic,
  } = useCampaignStore();
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  const stage = CAMPAIGN_DATA.find((s) => s.id === stageId) || CAMPAIGN_DATA[0];
  const selectedLevel = stage.levels.find((l) => l.id === selectedLevelId);

  // Puzzle State
  const pieces = stagePieces[stage.id] || [];
  const isRestored = relicsRestored.includes(stage.id);
  const canRestore = pieces.length >= 9 && !isRestored;

  // Bezier Path Logic
  const svgPath = useMemo(() => {
    let path = "";
    const centerX = width / 2;
    const offsetX = 40;
    stage.levels.forEach((_, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? centerX - offsetX : centerX + offsetX;
      const y = i * NODE_HEIGHT + 30;
      if (i === 0) path += `M ${x} ${y}`;
      else {
        const prevX = (i - 1) % 2 === 0 ? centerX - offsetX : centerX + offsetX;
        const prevY = (i - 1) * NODE_HEIGHT + 30;
        const cpY = (prevY + y) / 2;
        path += ` C ${prevX} ${cpY}, ${x} ${cpY}, ${x} ${y}`;
      }
    });
    return path;
  }, [stage]);

  const handleRestore = () => {
    unlockRelic(stage.id);
    // Sound effect here
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need permission to save the relic to your gallery."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + `${stage.id}_relic.jpg`;
      const downloadRes = await FileSystem.downloadAsync(
        stage.imageUrl,
        fileUri
      );

      await MediaLibrary.saveToLibraryAsync(downloadRes.uri);
      Alert.alert("Saved!", "Relic saved to your gallery.");
    } catch (e) {
      Alert.alert("Error", "Could not save image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={GAME_THEME.colors.primary}
          onPress={() => router.back()}
        />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>{stage.title.toUpperCase()}</Text>
          <Text style={styles.subTitle}>Stage {stage.order}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* RELIC SECTION */}
        <View style={{ marginBottom: 20 }}>
          <PuzzleGrid
            imageUrl={stage.imageUrl}
            collectedPieces={pieces}
            isRestored={isRestored}
          />

          {canRestore && (
            <BubblyButton
              title="RESTORE RELIC"
              onPress={handleRestore}
              color={GAME_THEME.colors.accent}
              style={{ marginTop: -20, width: 200, alignSelf: "center" }}
            />
          )}

          {isRestored && (
            <View style={styles.actionRow}>
              <BubblyButton
                title="SAVE IMAGE"
                onPress={handleDownload}
                icon={
                  <Ionicons name="download-outline" size={20} color="#FFF" />
                }
                color={GAME_THEME.colors.primary}
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>

        {/* MAP SECTION */}
        <View style={styles.mapContainer}>
          <View style={styles.svgContainer}>
            <Svg width={width} height={stage.levels.length * NODE_HEIGHT}>
              <Path
                d={svgPath}
                stroke="#E0E0E0"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="10 5"
              />
            </Svg>
          </View>

          {stage.levels.map((level, index) => (
            <LevelNode
              key={level.id}
              level={level}
              index={index}
              isUnlocked={unlockedLevelIds.includes(level.id)}
              isCompleted={completedLevelIds.includes(level.id)}
              stars={levelStars[level.id] || 0}
              onPress={() => setSelectedLevelId(level.id)}
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* START DIALOG */}
      <CustomDialog
        visible={!!selectedLevelId}
        onClose={() => setSelectedLevelId(null)}
        title="MISSION BRIEF"
        actions={[
          {
            label: "START MISSION",
            onPress: () => {
              setSelectedLevelId(null);
              setTimeout(
                () =>
                  router.push({
                    pathname: "/game/campaign/play",
                    params: { levelId: selectedLevelId, stageId: stage.id },
                  }),
                100
              );
            },
            type: "primary",
          },
          {
            label: "CANCEL",
            onPress: () => setSelectedLevelId(null),
            type: "secondary",
          },
        ]}
      >
        {selectedLevel && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text style={styles.dialogTitle}>{selectedLevel.title}</Text>
            <Text style={styles.dialogDesc}>{selectedLevel.description}</Text>
            <Text style={styles.reqText}>
              Requirements: 2 Stars to Unlock Next
            </Text>
          </View>
        )}
      </CustomDialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
  },
  headerTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 18,
    color: GAME_THEME.colors.primary,
  },
  subTitle: {
    fontFamily: GAME_THEME.fonts.regular,
    fontSize: 12,
    color: "#999",
  },
  scrollContent: { padding: 20 },
  mapContainer: { marginTop: 20, position: "relative" },
  svgContainer: { position: "absolute", top: 30, left: 0, right: 0, zIndex: 0 },
  actionRow: { marginTop: 10, paddingHorizontal: 40 },
  dialogTitle: {
    fontSize: 20,
    fontFamily: GAME_THEME.fonts.extraBold,
    marginBottom: 10,
  },
  dialogDesc: {
    textAlign: "center",
    fontFamily: GAME_THEME.fonts.regular,
    color: "#666",
    marginBottom: 15,
  },
  reqText: {
    fontFamily: GAME_THEME.fonts.bold,
    color: GAME_THEME.colors.danger,
    fontSize: 12,
  },
});
