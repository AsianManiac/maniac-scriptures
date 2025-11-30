import { useTheme } from "@/hooks/use-theme";
import { Book } from "@/types/bible";
import { ChevronLeft, X } from "lucide-react-native";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChapterVerseSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  book: Book;
  onSelectVerse: (chapter: number, verse: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 5;
const ITEM_MARGIN = 8;
const ITEM_SIZE =
  (SCREEN_WIDTH - 40 - ITEM_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export function ChapterVerseSelectorModal({
  visible,
  onClose,
  book,
  onSelectVerse,
}: ChapterVerseSelectorModalProps) {
  const { colors } = useTheme();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verseCount, setVerseCount] = useState<number>(31);

  const handleChapterSelect = (chapter: number) => {
    console.log("Selected chapter:", chapter);
    setSelectedChapter(chapter);

    const estimatedVerses =
      chapter === 119 && book.name === "Psalms" ? 176 : 31;
    setVerseCount(estimatedVerses);
  };

  const handleVerseSelect = (verse: number) => {
    if (selectedChapter) {
      console.log("Selected verse:", { chapter: selectedChapter, verse });
      onSelectVerse(selectedChapter, verse);
      onClose();
      setSelectedChapter(null);
    }
  };

  const handleBack = () => {
    setSelectedChapter(null);
  };

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  const NumberItem = ({
    number,
    onPress,
    index,
  }: {
    number: number;
    onPress: () => void;
    index: number;
  }) => {
    const scaleAnim = new Animated.Value(0.8);
    const opacityAnim = new Animated.Value(0);

    useState(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
          delay: index * 20,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          delay: index * 20,
        }),
      ]).start();
    });

    return (
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.numberCard,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.shadow,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
            },
          ]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.numberText, { color: colors.cardBackground }]}>
            {number}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            {selectedChapter && (
              <TouchableOpacity
                onPress={handleBack}
                style={[
                  styles.backButton,
                  { backgroundColor: colors.background },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
            )}

            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {book.name}
              </Text>
              {selectedChapter && (
                <Text style={[styles.chapterTitle, { color: colors.primary }]}>
                  Chapter {selectedChapter}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.background },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {selectedChapter
                ? `Select a verse from ${book.name} ${selectedChapter}`
                : `Select a chapter from ${book.name}`}
            </Text>
            <Text style={[styles.countText, { color: colors.textLight }]}>
              {selectedChapter
                ? `${verseCount} verses`
                : `${book.chapters} chapters`}
            </Text>
          </View>

          <ScrollView
            style={styles.numbersList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.numbersGrid}>
              {!selectedChapter
                ? chapters.map((chapter, index) => (
                    <NumberItem
                      key={chapter}
                      number={chapter}
                      index={index}
                      onPress={() => handleChapterSelect(chapter)}
                    />
                  ))
                : Array.from({ length: verseCount }, (_, i) => i + 1).map(
                    (verse, index) => (
                      <NumberItem
                        key={verse}
                        number={verse}
                        index={index}
                        onPress={() => handleVerseSelect(verse)}
                      />
                    )
                  )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    textAlign: "center" as const,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    marginBottom: 4,
  },
  countText: {
    fontSize: 14,
    textAlign: "center" as const,
  },
  numbersList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  numbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    gap: ITEM_MARGIN,
  },
  numberCard: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
