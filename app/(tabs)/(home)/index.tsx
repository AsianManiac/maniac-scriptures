import { BookSelectorModal } from "@/components/book-selector-modal";
import Colors from "@/constants/colors";
import { DEVOTIONALS } from "@/data/bible-data";
import { useTheme } from "@/hooks/use-theme";
import { generateHomeMessage } from "@/services/ai-service";
import { useBibleStore } from "@/stores/bible-store";
import { Book } from "@/types/bible";
import { useRouter } from "expo-router";
import { BookOpen, Clock, FileText, Heart, Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { history, favorites, notes, currentBook, currentChapter } =
    useBibleStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showBookSelector, setShowBookSelector] = useState<boolean>(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    generateHomeMessage("User", "For God so loved the world...").then(
      setGreeting
    ); // Example recent verse
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greeting}
            </Text>
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
                Today&apos;s Devotional
              </Text>
            </View>
            <Text style={[styles.devotionalTitle, { color: colors.text }]}>
              {todayDevotion.title}
            </Text>
            <Text
              style={[
                styles.devotionalContent,
                { color: colors.textSecondary },
              ]}
              numberOfLines={3}
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
            </TouchableOpacity>
          </View>

          <View style={styles.quickAccessCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Access
            </Text>
            <TouchableOpacity
              style={[
                styles.quickAccessButton,
                { backgroundColor: colors.primary, shadowColor: colors.shadow },
              ]}
              onPress={() => setShowBookSelector(true)}
            >
              <BookOpen size={20} color={colors.cardBackground} />
              <Text
                style={[
                  styles.quickAccessButtonText,
                  { color: colors.cardBackground },
                ]}
              >
                Browse Bible Books
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickLinksContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Links
            </Text>
            <View style={styles.quickLinksGrid}>
              <TouchableOpacity
                style={[styles.quickLinkCard]}
                onPress={() => router.push("/(tabs)/(notes)")}
              >
                <FileText size={28} color={colors.primary} />
                <Text style={[styles.quickLinkText, { color: colors.text }]}>
                  Notes
                </Text>
                <Text
                  style={[styles.quickLinkCount, { color: colors.primary }]}
                >
                  {notes.length}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLinkCard}
                onPress={() => router.push("/(tabs)/(favorites)")}
              >
                <Heart size={28} color={colors.primary} />
                <Text style={[styles.quickLinkText, { color: colors.text }]}>
                  Favorites
                </Text>
                <Text
                  style={[styles.quickLinkCount, { color: colors.primary }]}
                >
                  {favorites.length}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickLinkCard}>
                <BookOpen size={28} color={Colors.light.primary} />
                <Text style={[styles.quickLinkText, { color: colors.text }]}>
                  Plans
                </Text>
                <Text
                  style={[styles.quickLinkCount, { color: colors.primary }]}
                >
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickLinkCard}>
                <Clock size={28} color={Colors.light.primary} />
                <Text style={[styles.quickLinkText, { color: colors.text }]}>
                  History
                </Text>
                <Text
                  style={[styles.quickLinkCount, { color: colors.primary }]}
                >
                  {history.length}
                </Text>
              </TouchableOpacity>
            </View>
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    width: "80%",
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
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
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
    fontWeight: "500" as const,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  devotionalCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  devotionalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  devotionalLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  devotionalTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  devotionalContent: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  readMoreButton: {
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  continueReadingCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  continueButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  continueTextContainer: {
    flex: 1,
  },
  continueBookText: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  continueChapterText: {
    fontSize: 14,
  },
  quickAccessCard: {
    marginBottom: 24,
  },
  quickAccessButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAccessButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  quickLinksContainer: {
    marginBottom: 24,
  },
  quickLinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickLinkCard: {
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: "47%",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginTop: 12,
    marginBottom: 4,
  },
  quickLinkCount: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
});
