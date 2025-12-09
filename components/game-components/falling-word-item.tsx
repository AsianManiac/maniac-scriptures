import { GAME_THEME } from "@/constants/game-theme";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  cancelAnimation,
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
  lane: number;
  isCorrect: boolean;
  paused: boolean;
  fallDuration?: number; // Added speed prop
  onSelect: () => void;
  onMiss: () => void;
}

export const FallingWordItem = ({
  id,
  text,
  lane,
  paused,
  fallDuration = 4000,
  onSelect,
  onMiss,
}: Props) => {
  const translateY = useSharedValue(-80);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!paused) {
      translateY.value = withTiming(
        height + 100,
        {
          duration: fallDuration, // Use dynamic duration
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(onMiss)();
          }
        }
      );
    } else {
      cancelAnimation(translateY);
    }
  }, [paused]);

  const handlePress = () => {
    if (paused) return;
    cancelAnimation(translateY);

    scale.value = withSequence(
      withSpring(1.3),
      withTiming(0, { duration: 150 })
    ); // Faster pop
    opacity.value = withTiming(0, { duration: 150 });

    onSelect();
  };

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: lane * LANE_WIDTH + (LANE_WIDTH / 2 - 40) },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.bubble, rStyle]}>
      <Pressable style={styles.touchable} onPress={handlePress}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    borderWidth: 3,
    borderColor: GAME_THEME.colors.primary,
    borderBottomWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  touchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  text: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 14,
    textAlign: "center",
    color: GAME_THEME.colors.text,
  },
});
