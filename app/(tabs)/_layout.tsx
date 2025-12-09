import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs, router } from "expo-router";
import {
  Compass,
  FileText,
  Heart,
  Home,
  Plus,
  Settings,
  Star,
  UserCircle,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 5;

// Choose your style: "youtube" or "bilibili"
const TAB_STYLE = "bilibili"; // Change to "bilibili" for Bilibili style

const TABS =
  TAB_STYLE === "youtube"
    ? [
        { name: "(home)", label: "Home", icon: Home },
        { name: "(devotionals)", label: "Devotionals", icon: Heart },
        { name: "(notes)", label: "Notes", icon: FileText },
        { name: "(favorites)", label: "Favorites", icon: Star },
        { name: "(settings)", label: "Settings", icon: Settings },
      ]
    : [
        { name: "(home)", label: "Home", icon: Home },
        { name: "(devotionals)", label: "Devotionals", icon: Compass },
        { name: "(notes)", label: "Notes", icon: FileText },
        { name: "(favorites)", label: "Favourites", icon: Heart },
        { name: "(settings)", label: "Settings", icon: UserCircle },
      ];

export default function TabLayout() {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(1)).current;

  const handleTabPress = (index: number) => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setActiveIndex(index);
    activeTab.setValue(index);

    // Quick feedback animation
    if (TAB_STYLE === "bilibili" && index === 2) {
      Animated.sequence([
        Animated.timing(bubbleScale, {
          toValue: 0.9,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleScale, {
          toValue: 1,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Navigate instantly
    const tabName = TABS[index].name;
    router.push(`/${tabName}`);
  };

  const getIconColor = (index: number) => {
    return activeIndex === index ? colors.primary : colors.text;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Main Content Area - Takes full screen */}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        >
          {TABS.map(({ name, label }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title: label,
              }}
            />
          ))}
        </Tabs>
      </View>

      {/* Custom Tab Bar */}
      {TAB_STYLE === "youtube" ? (
        // YouTube Style
        <View
          style={[styles.container, { backgroundColor: colors.cardBackground }]}
        >
          <View style={styles.tabs}>
            {TABS.map(({ icon: Icon, label }, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tab}
                onPress={() => handleTabPress(index)}
                activeOpacity={0.6}
              >
                <Icon
                  color={getIconColor(index)}
                  size={24}
                  fill={
                    label === "Favorites" && activeIndex === index
                      ? colors.primary
                      : "none"
                  }
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: getIconColor(index),
                      opacity: activeIndex === index ? 1 : 0.7,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View
            style={[
              styles.activeIndicator,
              {
                backgroundColor: colors.primary,
                transform: [
                  {
                    translateX: activeTab.interpolate({
                      inputRange: [0, TABS.length - 1],
                      outputRange: [0, width - TAB_WIDTH],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      ) : (
        // Bilibili Style
        <View style={styles.bilibiliOuterContainer}>
          <BlurView intensity={80} tint="light" style={styles.bilibiliBlur}>
            <View style={styles.bilibiliTabsContainer}>
              {TABS.map(({ icon: Icon, label }, index) =>
                index === 2 ? (
                  <View key={index} style={styles.centerSpacer} />
                ) : (
                  <TouchableOpacity
                    key={index}
                    style={styles.bilibiliTab}
                    onPress={() => handleTabPress(index)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      color={getIconColor(index)}
                      size={22}
                      fill={
                        index === 3 && activeIndex === index
                          ? colors.primary
                          : "none"
                      }
                    />
                    <Text
                      style={[
                        styles.bilibiliLabel,
                        { color: getIconColor(index) },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </BlurView>

          {/* Floating Center Button */}
          <TouchableOpacity
            style={[
              styles.floatingCenterButton,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: bubbleScale }],
              },
            ]}
            onPress={() => handleTabPress(2)}
            activeOpacity={0.9}
          >
            <Plus color="#fff" size={26} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // YouTube Style
  container: {
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    borderRadius: 1.5,
  },

  // Bilibili Style
  bilibiliOuterContainer: {
    height: 80,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bilibiliBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  bilibiliTabsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  centerSpacer: {
    width: 60,
  },
  bilibiliTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  bilibiliLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
  floatingCenterButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 10,
    left: width / 2 - 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
