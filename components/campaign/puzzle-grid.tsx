import { GAME_THEME } from "@/constants/game-theme";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const GRID_SIZE = width - 60;
const CELL_SIZE = GRID_SIZE / 3;

interface Props {
  imageUrl: string;
  collectedPieces: number[]; // Indices 0-8
  isRestored: boolean; // Is the animation fully done/user clicked restore
}

export const PuzzleGrid = ({
  imageUrl,
  collectedPieces,
  isRestored,
}: Props) => {
  // If restored, we show the full image cleanly
  // If not, we show the grid with missing pieces

  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRestored) {
      flashOpacity.value = withSpring(1, {}, () => {
        flashOpacity.value = withDelay(500, withTiming(0));
      });
    }
  }, [isRestored]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>STAGE RELIC</Text>

      <View style={styles.gridWrapper}>
        {/* The Base Image (Hidden behind masks or shown fully) */}
        <Image source={{ uri: imageUrl }} style={styles.fullImage} />

        {/* The Grid Overlay */}
        {!isRestored && (
          <View style={styles.overlayContainer}>
            {Array.from({ length: 9 }).map((_, index) => {
              const isCollected = collectedPieces.includes(index);

              if (isCollected) {
                // Transparent block lets image show through
                return <View key={index} style={styles.cell} />;
              }

              // Locked block covers the image
              return (
                <View key={index} style={[styles.cell, styles.lockedCell]}>
                  <Text style={styles.qMark}>?</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Flash Effect Overlay */}
        <Animated.View style={[styles.flashOverlay, flashStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontFamily: GAME_THEME.fonts.extraBold,
    color: GAME_THEME.colors.accent,
    marginBottom: 10,
    letterSpacing: 2,
  },
  gridWrapper: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#EEE",
    position: "relative",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  lockedCell: {
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  qMark: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 24,
    color: "#CCC",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFF",
    zIndex: 20,
    pointerEvents: "none",
  },
});
