import { BubblyButton } from "@/components/game-components/bubbly-button";
import { GAME_THEME } from "@/constants/game-theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CustomDialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseIcon?: boolean;
  closeOnOutsideClick?: boolean;
  actions?: {
    label: string;
    onPress: () => void;
    type?: "primary" | "danger" | "secondary";
  }[];
  style?: ViewStyle;
}

export const CustomDialog = ({
  visible,
  onClose,
  title,
  children,
  showCloseIcon = true,
  closeOnOutsideClick = true,
  actions,
  style,
}: CustomDialogProps) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Much faster entry
      opacity.value = withTiming(1, { duration: 100 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      // Instant exit for state changes, slight fade for visual
      opacity.value = withTiming(0, { duration: 80 });
      scale.value = withTiming(0.95, { duration: 80 });
    }
  }, [visible]);

  const handleAction = (callback: () => void) => {
    // Hide immediately before performing the action (like navigation)
    // This prevents the dialog from lingering during screen transitions
    opacity.value = 0;
    callback();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnOutsideClick ? onClose : undefined}
        >
          <BlurView
            intensity={15}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </Pressable>

        <Animated.View style={[styles.dialogContainer, animatedStyle, style]}>
          {(title || showCloseIcon) && (
            <View style={styles.header}>
              <Text style={styles.title}>{title || ""}</Text>
              {showCloseIcon && (
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons
                    name="close"
                    size={20}
                    color={GAME_THEME.colors.textLight}
                  />
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {actions && actions.length > 0 && (
            <View style={styles.footer}>
              {actions.map((action, index) => (
                <BubblyButton
                  key={index}
                  title={action.label}
                  onPress={() => handleAction(action.onPress)}
                  color={
                    action.type === "danger"
                      ? GAME_THEME.colors.danger
                      : action.type === "secondary"
                      ? GAME_THEME.colors.secondary
                      : GAME_THEME.colors.primary
                  }
                  style={{ flex: 1, marginHorizontal: 4, height: 45 }} // Compact buttons
                />
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // Lighter dim for speed perception
    padding: 20,
  },
  dialogContainer: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#F0F0F0",
    borderBottomWidth: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 20,
    color: GAME_THEME.colors.text,
    textAlign: "center",
    flex: 1,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  content: {
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
