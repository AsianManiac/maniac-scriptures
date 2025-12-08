import { GAME_THEME } from "@/constants/game-theme";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height, width } = Dimensions.get("window");
const LANE_WIDTH = width / 3;

interface Props {
  id: string;
  text: string;
  xLane: number;
  onSlice: () => void;
  onMiss: () => void;
}

export const FallingWord = ({ id, text, xLane, onSlice, onMiss }: Props) => {
  const translateY = useSharedValue(-100);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animate falling
    translateY.value = withTiming(
      height,
      {
        duration: 4000, // Speed varies by difficulty
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(onMiss)();
        }
      }
    );
  }, []);

  const handlePress = () => {
    // Cancel falling animation visually
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withSequence(withSpring(1.5), withSpring(0));
    onSlice();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: xLane * LANE_WIDTH + (LANE_WIDTH / 2 - 40) }, // Center in lane
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.wordBubble, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.touchArea}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wordBubble: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GAME_THEME.colors.white,
    borderWidth: 3,
    borderColor: GAME_THEME.colors.primary,
    borderBottomWidth: 6, // 3D
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
  },
  touchArea: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 14,
    color: GAME_THEME.colors.text,
  },
});
