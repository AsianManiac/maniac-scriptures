import { GAME_THEME } from "@/constants/game-theme";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  id: string;
  word: string;
  lane: number; // 0, 1, 2
  speed: number;
  onSlice: () => void;
  onMiss: () => void;
}

export const NinjaWord = ({
  id,
  word,
  lane,
  speed,
  onSlice,
  onMiss,
}: Props) => {
  const translateY = useSharedValue(-100);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(
      800,
      {
        // Drop to bottom
        duration: speed,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) runOnJS(onMiss)();
      }
    );
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cancel the drop animation visually
    translateY.value = translateY.value;
    // Popping animation
    scale.value = withSequence(
      withSpring(1.4),
      withTiming(0, { duration: 200 })
    );
    opacity.value = withTiming(0, { duration: 200 });
    onSlice();
  };

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: (lane - 1) * 110 }, // Center lane is 0. Left -110, Right +110
    ],
    opacity: opacity.value,
    scale: scale.value,
  }));

  return (
    <Animated.View style={[styles.bubble, style]}>
      <Pressable style={styles.touchable} onPress={handlePress}>
        <Text style={styles.text}>{word}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF",
    borderWidth: 3,
    borderColor: GAME_THEME.colors.primary,
    borderBottomWidth: 6, // 3D Effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  touchable: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 16,
    color: GAME_THEME.colors.text,
  },
});
