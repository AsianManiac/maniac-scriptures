import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg"; // Standard Expo component

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 28,
  strokeWidth = 3,
  color,
}: CircularProgressProps) {
  const { colors } = useTheme();
  const stroke = color || colors.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  );
}
