import React from 'react';
import { Text, Pressable, ViewStyle, TextStyle, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/game-theme';
import * as Haptics from 'expo-haptics';

interface Props {
  title: string;
  onPress: () => void;
  color?: string; // Main color
  shadowColor?: string; // Darker shade
  textColor?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const BubblyButton: React.FC<Props> = ({
  title,
  onPress,
  color = GAME_THEME.colors.primary,
  shadowColor = GAME_THEME.colors.primaryShadow,
  textColor = '#FFF',
  icon,
  style
}) => {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    offset.value = withSpring(GAME_THEME.layout.buttonDepth, { stiffness: 300, damping: 15 });
  };

  const handlePressOut = () => {
    offset.value = withSpring(0, { stiffness: 300, damping: 15 });
    onPress();
  };

  return (
    <View style={[{ height: 50 + GAME_THEME.layout.buttonDepth }, style]}>
      {/* The Shadow Layer */}
      <View
        style={{
          position: 'absolute',
          top: GAME_THEME.layout.buttonDepth,
          left: 0,
          right: 0,
          height: 50,
          backgroundColor: shadowColor,
          borderRadius: GAME_THEME.layout.radius.m,
        }}
      />
      
      {/* The Touchable Top Layer */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            {
              height: 50,
              backgroundColor: color,
              borderRadius: GAME_THEME.layout.radius.m,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            },
            animatedStyle,
          ]}
        >
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={{ fontFamily: GAME_THEME.fonts.extraBold, color: textColor, fontSize: 18 }}>
            {title.toUpperCase()}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};