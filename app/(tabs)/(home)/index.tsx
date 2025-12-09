import { BookSelectorModal } from "@/components/book-selector-modal";
import { DEVOTIONALS } from "@/data/bible-data";
import { useTheme } from "@/hooks/use-theme";
import { generateHomeMessage } from "@/services/ai-service";
import { useBibleStore } from "@/stores/bible-store";
import { Book } from "@/types/bible";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { BookOpen, Gamepad, Heart, Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    history,
    favorites,
    notes,
    currentBook,
    currentChapter,
    dailyStreak = 0,
  } = useBibleStore(); // Added dailyStreak
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // New scale animation for cards
  const [showBookSelector, setShowBookSelector] = useState<boolean>(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    generateHomeMessage("User", "For God so loved the world...").then(
      setGreeting
    );
  }, []);

  const todayDevotion = DEVOTIONALS[0];
  const verseOfDay = {
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    reference: "John 3:16",
  };

  const handleBookSelect = (book: Book) => {
    useBibleStore.getState().setCurrentBook(book.name);
    useBibleStore.getState().setCurrentChapter(1);
    router.push("/(bible)");
  };

  // Quick Access items (example data; expand as needed)
  const quickAccessItems = [
    {
      icon: BookOpen,
      label: "Browse Books",
      onPress: () => setShowBookSelector(true),
    },
    {
      icon: Heart,
      label: "Favorites",
      onPress: () => router.push("/(tabs)/(favorites)"),
    },
    {
      icon: Gamepad,
      label: "Campaigns",
      onPress: () => router.push("/game/game-hub"),
    },
    // Add more...
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, { color: colors.text }]}>
                {greeting}
              </Text>
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text style={[styles.streakText, { color: colors.primary }]}>
                  Streak: {dailyStreak}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.searchButton,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => router.push("/search" as any)}
            >
              <Search size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.verseOfDayCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.verseOfDayLabel, { color: colors.primary }]}>
              Verse of the Day
            </Text>
            <Text style={[styles.verseText, { color: colors.text }]}>
              {verseOfDay.text}
            </Text>
            <Text
              style={[styles.verseReference, { color: colors.textSecondary }]}
            >
              {verseOfDay.reference}
            </Text>
          </View>

          <View
            style={[
              styles.devotionalCard,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <View style={styles.devotionalHeader}>
              <Heart size={20} color={colors.primary} fill={colors.primary} />
              <Text
                style={[styles.devotionalLabel, { color: colors.primaryDark }]}
              >
                Today's Devotional
              </Text>
            </View>
            {/* Placeholder for image */}
            <View
              style={[
                styles.devotionalImage,
                { backgroundColor: colors.border },
              ]}
            >
              <Image
                style={{ flex: 1, width: "100%", backgroundColor: "#0553" }}
                source={{
                  uri: "https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1000&auto=format&fit=crop",
                }}
                placeholder={{ blurhash }}
                transition={1000}
                contentFit="cover"
              />
            </View>
            <Text style={[styles.devotionalTitle, { color: colors.text }]}>
              {todayDevotion.title}
            </Text>
            <Text
              style={[
                styles.devotionalContent,
                { color: colors.textSecondary },
              ]}
              numberOfLines={2}
            >
              {todayDevotion.content}
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => router.push("/(tabs)/(devotionals)")}
            >
              <Text style={[styles.readMoreText, { color: colors.primary }]}>
                Read More
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.continueReadingCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Continue Reading
            </Text>
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => router.push("/(bible)")}
            >
              <BookOpen size={24} color={colors.primary} />
              <View style={styles.continueTextContainer}>
                <Text style={[styles.continueBookText, { color: colors.text }]}>
                  {currentBook}
                </Text>
                <Text
                  style={[
                    styles.continueChapterText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Chapter {currentChapter}
                </Text>
              </View>
              {/* Progress indicator example */}
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: "50%", backgroundColor: colors.primary },
                  ]}
                />
                <Text> </Text>
                {/* Example 50% */}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.quickAccessCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Access
            </Text>
            <FlatList
              horizontal
              data={quickAccessItems}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.quickAccessButton,
                    {
                      backgroundColor: colors.primary,
                      shadowColor: colors.shadow,
                    },
                  ]}
                  onPress={item.onPress}
                >
                  <item.icon size={20} color={colors.cardBackground} />
                  <Text
                    style={[
                      styles.quickAccessButtonText,
                      { color: colors.cardBackground },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.label}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAccessList}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <BookSelectorModal
        visible={showBookSelector}
        onClose={() => setShowBookSelector(false)}
        onSelectBook={handleBookSelect}
        currentBook={currentBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  greeting: { fontSize: 32, fontWeight: "700", maxWidth: "70%" },
  streakBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakText: { fontSize: 14, fontWeight: "600" },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  verseOfDayCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  verseOfDayLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
    fontWeight: "500",
  },
  verseReference: { fontSize: 14, fontWeight: "600" },
  devotionalCard: { borderRadius: 20, padding: 24, marginBottom: 20 },
  devotionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  devotionalLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  devotionalImage: { height: 100, borderRadius: 12, marginBottom: 12 }, // Add image source here
  devotionalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  devotionalContent: { fontSize: 15, lineHeight: 24, marginBottom: 16 },
  readMoreButton: { alignSelf: "flex-start" },
  readMoreText: { fontSize: 15, fontWeight: "700" },
  continueReadingCard: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  continueButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    elevation: 3,
  },
  continueTextContainer: { flex: 1 },
  continueBookText: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  continueChapterText: { fontSize: 14 },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    width: 80,
    marginLeft: "auto",
  },
  progressFill: { height: "100%" },
  quickAccessCard: { marginBottom: 24 },
  quickAccessList: { gap: 12 },
  quickAccessButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    width: 140, // For horizontal scroll
  },
  quickAccessButtonText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  quickLinksContainer: { marginBottom: 24 },
  quickLinksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  quickLinkCard: {
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: "47%",
    alignItems: "center",
    // Add press effect in TouchableOpacity if needed
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  quickLinkCount: { fontSize: 20, fontWeight: "700" },
});
