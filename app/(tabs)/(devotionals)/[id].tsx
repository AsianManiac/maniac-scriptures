import { VerseReferenceDialog } from "@/components/verse-reference-dialog";
import { DEVOTIONALS } from "@/data/bible-data";
import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BookOpen, Clock, Heart, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevotionalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { navigateToVerse } = useBibleStore();

  const [selectedVerse, setSelectedVerse] = useState<{
    book: string;
    chapter: number;
    verse: number;
  } | null>(null);
  const [showVerseDialog, setShowVerseDialog] = useState<boolean>(false);

  const devotional = DEVOTIONALS.find((d) => d.id === id);

  if (!devotional) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Devotional not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const recommendations = DEVOTIONALS.filter(
    (d) => d.id !== id && d.category === devotional.category
  ).slice(0, 3);

  const handleVerseReferencePress = (
    book: string,
    chapter: number,
    verse: number
  ) => {
    console.log("Verse reference pressed:", { book, chapter, verse });
    setSelectedVerse({ book, chapter, verse });
    setShowVerseDialog(true);
  };

  const handleGoToVerse = () => {
    if (selectedVerse) {
      navigateToVerse(
        selectedVerse.book,
        selectedVerse.chapter,
        selectedVerse.verse
      );
      router.push("/(tabs)/(bible)");
    }
  };

  const renderContentWithVerseReferences = (text: string) => {
    const versePattern =
      /\b([1-3]?\s?[A-Z][a-z]+(?:\s+of\s+[A-Z][a-z]+)?)\s+(\d+):(\d+(?:-\d+)?)\b/g;
    const parts: React.JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    while ((match = versePattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <Text
            key={`text-${lastIndex}`}
            style={[styles.devotionalContentText, { color: colors.text }]}
          >
            {text.substring(lastIndex, match.index)}
          </Text>
        );
      }

      const book = match[1].trim();
      const chapter = parseInt(match[2]);
      const verseStr = match[3];
      const verse = parseInt(verseStr.split("-")[0]);

      parts.push(
        <Text
          key={`verse-${match.index}`}
          style={[styles.verseLink, { color: colors.primary }]}
          onPress={() => handleVerseReferencePress(book, chapter, verse)}
        >
          {match[0]}
        </Text>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <Text
          key={`text-${lastIndex}`}
          style={[styles.devotionalContentText, { color: colors.text }]}
        >
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return <Text>{parts}</Text>;
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
        <View style={styles.content}>
          <View
            style={[styles.header, { backgroundColor: colors.primaryLight }]}
          >
            <View style={styles.categoryBadge}>
              <Text
                style={[
                  styles.categoryBadgeText,
                  { color: colors.primaryDark },
                ]}
              >
                {devotional.category}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {devotional.date}
              </Text>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {devotional.title}
            </Text>
          </View>

          <View
            style={[
              styles.verseCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <TouchableOpacity
              style={styles.verseHeader}
              onPress={() =>
                handleVerseReferencePress(
                  devotional.verseReference.book,
                  devotional.verseReference.chapter,
                  devotional.verseReference.verse
                )
              }
            >
              <BookOpen size={20} color={colors.primary} />
              <Text
                style={[styles.verseReferenceText, { color: colors.primary }]}
              >
                {devotional.verseReference.book}{" "}
                {devotional.verseReference.chapter}:
                {devotional.verseReference.verse}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.verseTextContent, { color: colors.text }]}>
              {devotional.verseText}
            </Text>
          </View>

          <View style={styles.contentContainer}>
            {renderContentWithVerseReferences(devotional.content)}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleGoToVerse}
            >
              <BookOpen size={20} color={colors.cardBackground} />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.cardBackground },
                ]}
              >
                Read Full Chapter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButtonSecondary,
                { borderColor: colors.border },
              ]}
            >
              <Share2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButtonSecondary,
                { borderColor: colors.border },
              ]}
            >
              <Heart size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <Text
                style={[styles.recommendationsTitle, { color: colors.text }]}
              >
                More in {devotional.category}
              </Text>
              {recommendations.map((rec) => (
                <TouchableOpacity
                  key={rec.id}
                  style={[
                    styles.recommendationCard,
                    { backgroundColor: colors.cardBackground },
                  ]}
                  onPress={() => router.push(`/(tabs)/(devotionals)/${rec.id}`)}
                >
                  <View style={styles.recommendationHeader}>
                    <View
                      style={[
                        styles.recommendationBadge,
                        { backgroundColor: colors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recommendationBadgeText,
                          { color: colors.primaryDark },
                        ]}
                      >
                        {rec.category}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.recommendationDate,
                        { color: colors.textLight },
                      ]}
                    >
                      {rec.date}
                    </Text>
                  </View>
                  <Text
                    style={[styles.recommendationTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {rec.title}
                  </Text>
                  <Text
                    style={[
                      styles.recommendationContent,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={2}
                  >
                    {rec.content}
                  </Text>
                  <View style={styles.recommendationVerseContainer}>
                    <BookOpen size={14} color={colors.primary} />
                    <Text
                      style={[
                        styles.recommendationVerseText,
                        { color: colors.primary },
                      ]}
                    >
                      {rec.verseReference.book} {rec.verseReference.chapter}:
                      {rec.verseReference.verse}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {selectedVerse && (
        <VerseReferenceDialog
          visible={showVerseDialog}
          onClose={() => setShowVerseDialog(false)}
          book={selectedVerse.book}
          chapter={selectedVerse.chapter}
          verse={selectedVerse.verse}
          onGoToVerse={handleGoToVerse}
        />
      )}
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
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 15,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  verseCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  verseReferenceText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  verseTextContent: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic" as const,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  devotionalContentText: {
    fontSize: 17,
    lineHeight: 28,
  },
  verseLink: {
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "700" as const,
    textDecorationLine: "underline" as const,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  actionButtonSecondary: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  recommendationsSection: {
    paddingHorizontal: 20,
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  recommendationCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendationBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  recommendationDate: {
    fontSize: 11,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 8,
  },
  recommendationContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationVerseContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recommendationVerseText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
});
