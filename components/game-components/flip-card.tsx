import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/game-theme';
import { LucideIcon } from 'lucide-react-native';

interface Props {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  categoryIcon: React.ReactNode;
  categoryColor: string;
}

export const FlipCard: React.FC<Props> = ({ 
  frontContent, 
  backContent, 
  isFlipped, 
  onFlip,
  categoryIcon,
  categoryColor
}) => {
  const rotateY = useSharedValue(0);

  // Update rotation when prop changes
  React.useEffect(() => {
    rotateY.value = withTiming(isFlipped ? 180 : 0, { duration: 500 });
  }, [isFlipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: rotateY.value < 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 180], [180, 360], Extrapolate.CLAMP);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: rotateY.value > 90 ? 1 : 0,
    };
  });

  return (
    <Pressable onPress={onFlip} style={styles.container}>
      {/* Front Side */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, { borderColor: categoryColor }]}>
        <View style={[styles.iconBadge, { backgroundColor: categoryColor }]}>
          {categoryIcon}
        </View>
        <View style={styles.contentContainer}>
          {frontContent}
          <Text style={styles.tapHint}>Tap to reveal</Text>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { borderColor: categoryColor }]}>
         {backContent}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: GAME_THEME.colors.white,
    borderRadius: GAME_THEME.layout.radius.xl,
    borderWidth: 3,
    borderBottomWidth: 8, // Thicker bottom for 3D look
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
    transform: [{ rotateY: '180deg' }], // Initial state
    backgroundColor: '#FFFBE6', // Slight tint for backside
  },
  iconBadge: {
    position: 'absolute',
    top: -20,
    padding: 12,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    marginTop: 20,
    fontFamily: GAME_THEME.fonts.bold,
    color: GAME_THEME.colors.textLight,
    opacity: 0.6,
  }
});