import { GAME_THEME } from "@/constants/game-theme";
import { PAULS_JOURNEY } from "@/data/map-journeys";
import { useGameAudio } from "@/hooks/use-game-audio";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function MapExplorerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { play } = useGameAudio();
  const mapRef = useRef<AppleMaps.MapView | GoogleMaps.MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [ancientMode, setAncientMode] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  // Toggle Logic
  const toggleMode = () => {
    play("pop");
    setAncientMode(!ancientMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Convert Data for Expo Maps
  const markers = PAULS_JOURNEY.locations.map((loc) => ({
    id: loc.id,
    title: loc.title,
    coordinates: loc.coordinates,
    systemImage:
      loc.type === "DANGER"
        ? "exclamationmark.triangle.fill"
        : "mappin.circle.fill",
    tintColor:
      loc.type === "DANGER"
        ? GAME_THEME.colors.danger
        : GAME_THEME.colors.primary,
  }));

  const polylines = [
    {
      cordinates: PAULS_JOURNEY.path,
      color: GAME_THEME.colors.accent,
      width: 4,
      pattern: ancientMode ? [10, 5] : [], // Dashed for ancient feel
    },
  ];

  const polygons = ancientMode
    ? [
        {
          points: PAULS_JOURNEY.ancientEmpirePoly,
          fillColor: "rgba(255, 200, 0, 0.15)", // Gold overlay
          strokeColor: "rgba(255, 200, 0, 0.5)",
          strokeWidth: 2,
        },
      ]
    : [];

  // Interaction Handlers
  const onMarkerPress = (id: string) => {
    play("whoosh");
    setSelectedLocationId(id);

    // Scroll the bottom list to the selected item
    const index = PAULS_JOURNEY.locations.findIndex((l) => l.id === id);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 300, animated: true });
    }
  };

  const onCardPress = (location: any) => {
    play("whoosh");
    setSelectedLocationId(location.id);

    // Move Camera
    mapRef.current?.setCameraPosition({
      coordinates: location.coordinates,
      zoom: 10,
      // animate: true
    });
  };

  const renderMap = () => {
    if (Platform.OS === "ios") {
      return (
        <AppleMaps.View
          ref={mapRef as any}
          style={StyleSheet.absoluteFill}
          mapType={
            ancientMode ? AppleMapsMapType.HYBRID : AppleMapsMapType.STANDARD
          }
          markers={markers}
          polylines={polylines}
          polygons={polygons}
          onMarkerClick={(e) => onMarkerPress(e.id)}
          uiSettings={{ compassEnabled: false, myLocationButtonEnabled: false }}
        />
      );
    } else {
      return (
        <GoogleMaps.View
          ref={mapRef as any}
          style={StyleSheet.absoluteFill}
          mapType={
            ancientMode ? GoogleMapsMapType.SATELLITE : GoogleMapsMapType.NORMAL
          }
          markers={markers}
          polylines={polylines}
          polygons={polygons}
          onMarkerClick={(e) => onMarkerPress(e.id)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderMap()}

      <View style={[styles.header, { top: insets.top }]}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={GAME_THEME.colors.text}
          />
        </TouchableOpacity>

        <View style={styles.toggleContainer}>
          <Text style={[styles.toggleText, !ancientMode && styles.activeText]}>
            Modern
          </Text>
          <Switch
            value={ancientMode}
            onValueChange={toggleMode}
            trackColor={{ false: "#DDD", true: GAME_THEME.colors.accent }}
            thumbColor={"#FFF"}
          />
          <Text style={[styles.toggleText, ancientMode && styles.activeText]}>
            AD 60
          </Text>
        </View>

        <TouchableOpacity style={styles.circleBtn} onPress={() => {}}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={GAME_THEME.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* 3. Bottom Scroll Layer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={312} // Card width + margin
          decelerationRate="fast"
        >
          {PAULS_JOURNEY.locations.map((loc, index) => (
            <Animated.View
              key={loc.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  selectedLocationId === loc.id && styles.selectedCard,
                ]}
                activeOpacity={0.9}
                onPress={() => onCardPress(loc)}
              >
                <Image source={loc.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.cardBadge}>
                    <Text style={styles.badgeText}>STOP {index + 1}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{loc.title}</Text>
                  <Text numberOfLines={2} style={styles.cardDesc}>
                    {loc.description}
                  </Text>

                  <View style={styles.cardAction}>
                    <Text style={styles.readMore}>Tap to explore</Text>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={20}
                      color={GAME_THEME.colors.primary}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  toggleText: {
    fontFamily: GAME_THEME.fonts.bold,
    fontSize: 12,
    color: "#999",
  },
  activeText: { color: GAME_THEME.colors.text, fontWeight: "800" },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  scrollContent: { paddingHorizontal: 20, gap: 12 },

  card: {
    width: 300,
    height: 140,
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderBottomWidth: 4,
    borderColor: "#eee",
  },
  selectedCard: { borderColor: GAME_THEME.colors.primary },
  cardImage: {
    width: 90,
    height: "100%",
    borderRadius: 14,
    backgroundColor: "#eee",
  },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardBadge: {
    backgroundColor: GAME_THEME.colors.accent,
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: GAME_THEME.fonts.extraBold,
    color: "#fff",
  },
  cardTitle: {
    fontFamily: GAME_THEME.fonts.extraBold,
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  cardDesc: {
    fontFamily: GAME_THEME.fonts.regular,
    fontSize: 12,
    color: "#666",
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  readMore: {
    fontSize: 10,
    fontFamily: GAME_THEME.fonts.bold,
    color: GAME_THEME.colors.primary,
  },
});
