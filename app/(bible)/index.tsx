import { ChapterVerseSelectorModal } from "@/components/bible-verse-selector-modal";
import { VerseActionsSheet } from "@/components/verse-action-sheet";
import { VersionSelectorModal } from "@/components/version-selector-modal";
import { useTheme } from "@/hooks/use-theme";
import { generateNoteFromVerse } from "@/services/ai-service";
import { useBibleStore } from "@/stores/bible-store";
import { Verse, VerseReference } from "@/types/bible";
import { fetchChapter, getBook } from "@/utils/bible-api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BibleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentBook,
    currentChapter,
    setCurrentChapter,
    targetVerse,
    setTargetVerse,
    getHighlightForVerse,
    settings,
    setDefaultVersion,
  } = useBibleStore();

  const [selectedVerse, setSelectedVerse] = useState<VerseReference | null>(
    null
  );
  const [selectedVerseText, setSelectedVerseText] = useState<string>("");
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showChapterSelector, setShowChapterSelector] =
    useState<boolean>(false);
  const [showVersionSelector, setShowVersionSelector] =
    useState<boolean>(false);
  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [aiGeneratedNote, setAiGeneratedNote] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const targetVerseRefs = useRef<{ [key: number]: any }>({});
  const flickerAnim = useRef(new Animated.Value(0)).current;
  const navBarAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef<number>(0);

  const book = getBook(currentBook);

  const {
    data: verses,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "bible",
      book?.id,
      book?.name,
      currentChapter,
      settings.defaultBibleVersion,
    ],
    queryFn: async () => {
      if (!book) return [];
      return await fetchChapter(
        book.id,
        book.name,
        currentChapter,
        settings.defaultBibleVersion
      );
    },
    enabled: !!book,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (targetVerse && verses && verses.length > 0) {
      console.log("Scrolling to target verse:", targetVerse);

      setTimeout(() => {
        if (targetVerseRefs.current[targetVerse]) {
          targetVerseRefs.current[targetVerse]?.measureLayout(
            scrollViewRef.current as any,
            (_x: any, y: any) => {
              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - 100),
                animated: true,
              });

              Animated.sequence([
                Animated.timing(flickerAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }),
                Animated.timing(flickerAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }),
                Animated.timing(flickerAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }),
                Animated.timing(flickerAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }),
              ]).start(() => {
                setTargetVerse(null);
              });
            }
          );
        }
      }, 500);
    }
  }, [targetVerse, verses, setTargetVerse, flickerAnim, setDefaultVersion]);

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setTargetVerse(null);
    }
  };

  const handleNextChapter = () => {
    if (book && currentChapter < book.chapters) {
      setCurrentChapter(currentChapter + 1);
      setTargetVerse(null);
    }
  };

  const handleVersePress = useCallback(
    (verse: VerseReference, text: string) => {
      console.log("Verse pressed:", verse);
      setSelectedVerse(verse);
      setSelectedVerseText(text);
      setShowActions(true);
    },
    []
  );

  const handleChapterVerseSelect = (chapter: number, verse: number) => {
    console.log("Chapter/Verse selected:", { chapter, verse });
    setCurrentChapter(chapter);
    setTargetVerse(verse);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollingDown = currentScrollY > lastScrollY.current;

    lastScrollY.current = currentScrollY;

    if (scrollingDown && showNavBar && currentScrollY > 100) {
      setShowNavBar(false);
      Animated.timing(navBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!scrollingDown && !showNavBar) {
      setShowNavBar(true);
      Animated.timing(navBarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVerseStyle = (verse: VerseReference) => {
    const highlight = getHighlightForVerse(verse);
    const isTarget = targetVerse === verse.verse;

    const highlightColors: Record<string, string> = {
      yellow: colors.highlightYellow,
      green: colors.highlightGreen,
      blue: colors.highlightBlue,
      pink: colors.highlightPink,
      orange: colors.highlightOrange,
    };

    if (isTarget && highlight) {
      return {
        backgroundColor:
          highlightColors[highlight.color] || colors.highlightYellow,
      };
    } else if (isTarget) {
      const backgroundColor = flickerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", colors.primaryLight],
      });
      return { backgroundColor };
    } else if (highlight) {
      return {
        backgroundColor:
          highlightColors[highlight.color] || colors.highlightYellow,
      };
    }

    return {};
  };

  const handleVersionChange = async (versionId: string) => {
    setDefaultVersion(versionId);
    setShowVersionSelector(false);
    // The query will automatically refetch due to queryKey change
  };

  const toggleVerseSelect = (verseNum: number) => {
    setSelectionMode(true);
    setSelectedVerses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(verseNum)) newSet.delete(verseNum);
      else newSet.add(verseNum);
      if (newSet.size === 0) setSelectionMode(false);
      return newSet;
    });
  };

  const handleLongPress = (verseRef: VerseReference, text: string) => {
    setSelectedVerse(verseRef);
    setSelectedVerseText(text);
    setShowActions(true);
  };

  const handleHeaderAction = async () => {
    const combinedText = Array.from(selectedVerses)
      .sort((a, b) => a - b)
      .map((v) => verses?.find((verse) => verse.verse === v)?.text || "")
      .join("\n");
    setSelectedVerseText(combinedText);
    setSelectedVerse({ book: currentBook, chapter: currentChapter, verse: 0 }); // 0 for multi
    setShowActions(true);
  };

  const generateAiNote = async () => {
    try {
      const noteText = await generateNoteFromVerse(selectedVerseText, {
        tone: "reflective",
        length: "medium",
      });
      setAiGeneratedNote(noteText);
      setShowNoteEditor(true);
    } catch (error) {
      Alert.alert("AI Error", "Failed to generate note.");
    }
  };
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.bookSelectorButton}
          onPress={() => setShowChapterSelector(true)}
        >
          <BookOpen size={20} color={colors.primary} />
          <Text style={[styles.bookSelectorText, { color: colors.text }]}>
            {currentBook} {currentChapter}
          </Text>
        </TouchableOpacity>
        {/* Version selector button */}
        <TouchableOpacity
          style={[styles.versionButton, { backgroundColor: colors.background }]}
          onPress={() => setShowVersionSelector(true)}
        >
          <Text style={[styles.versionButtonText, { color: colors.primary }]}>
            {settings.defaultBibleVersion.toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.background }]}
            onPress={() => router.push("/search" as any)}
          >
            <Search size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading {currentBook} {currentChapter}...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Failed to load chapter
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {}}
          >
            <Text
              style={[styles.retryButtonText, { color: colors.cardBackground }]}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.content}>
            {/* Commented this out for now because of redundancy */}
            {/* <Text style={[styles.chapterTitle, { color: colors.text }]}>
              {currentBook} {currentChapter}
            </Text> */}

            {verses &&
              verses.map((verse: Verse) => {
                const verseRef: VerseReference = {
                  book: verse.book,
                  chapter: verse.chapter,
                  verse: verse.verse,
                };

                const isAnimatedVerse = targetVerse === verse.verse;
                const VerseContainer = isAnimatedVerse ? Animated.View : View;
                const verseStyle = getVerseStyle(verseRef);

                return (
                  <VerseContainer
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    ref={(ref) => {
                      targetVerseRefs.current[verse.verse] = ref;
                    }}
                    style={[styles.verseContainer, verseStyle]}
                  >
                    <Pressable
                      onPress={() => handleVersePress(verseRef, verse.text)}
                      onLongPress={() => handleVersePress(verseRef, verse.text)}
                      style={styles.versePressable}
                    >
                      <Text
                        style={[styles.verseNumber, { color: colors.primary }]}
                      >
                        {verse.verse}
                      </Text>
                      <Text
                        style={[
                          styles.verseText,
                          {
                            fontSize: settings.fontSize,
                            lineHeight: settings.fontSize * 1.5,
                            color: colors.text,
                          },
                        ]}
                      >
                        {verse.text}
                      </Text>
                    </Pressable>
                  </VerseContainer>
                );
              })}

            {(!verses || verses.length === 0) && !isLoading && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textLight }]}>
                  No verses available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <Animated.View
        style={[
          styles.navigationBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
            shadowColor: colors.shadow,
          },
          {
            transform: [
              {
                translateY: navBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            opacity: navBarAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.navButton,
            currentChapter === 1 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousChapter}
          disabled={currentChapter === 1}
        >
          <ChevronLeft
            size={20}
            color={currentChapter === 1 ? colors.textLight : colors.primary}
          />
          <Text
            style={[
              styles.navButtonText,
              { color: colors.primary },
              currentChapter === 1 && { color: colors.textLight },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View
          style={[styles.chapterIndicator, { backgroundColor: colors.primary }]}
        >
          <Text
            style={[
              styles.chapterIndicatorText,
              { color: colors.cardBackground },
            ]}
          >
            {currentChapter}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            book && currentChapter >= book.chapters && styles.navButtonDisabled,
          ]}
          onPress={handleNextChapter}
          disabled={book ? currentChapter >= book.chapters : true}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: colors.primary },
              book &&
                currentChapter >= book.chapters && { color: colors.textLight },
            ]}
          >
            Next
          </Text>
          <ChevronRight
            size={20}
            color={
              book && currentChapter >= book.chapters
                ? colors.textLight
                : colors.primary
            }
          />
        </TouchableOpacity>
      </Animated.View>

      {selectedVerse && (
        <VerseActionsSheet
          verse={selectedVerse}
          verseText={selectedVerseText}
          visible={showActions}
          onClose={() => setShowActions(false)}
        />
      )}

      {book && (
        <ChapterVerseSelectorModal
          visible={showChapterSelector}
          onClose={() => setShowChapterSelector(false)}
          book={book}
          onSelectVerse={handleChapterVerseSelect}
        />
      )}

      {/* Version Selector Modal */}
      <VersionSelectorModal
        visible={showVersionSelector}
        onClose={() => setShowVersionSelector(false)}
        currentVersion={settings.defaultBibleVersion}
        onVersionSelect={handleVersionChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  bookSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bookSelectorText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  versionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  versionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 5,
    paddingBottom: 8,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  verseContainer: {
    marginBottom: 2,
    borderRadius: 8,
  },
  versePressable: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: "700" as const,
    marginRight: 3,
    marginTop: 2,
    minWidth: 20,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  navigationBar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  chapterIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  chapterIndicatorText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
