import { useTheme } from "@/hooks/use-theme";
import { Book } from "@/types/bible";
import { ChevronLeft, X } from "lucide-react-native";
import { useState } from "react";
import {
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
              >
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            <Text style={[styles.title, { color: colors.text }]}>
              {selectedChapter ? `${book.name} ${selectedChapter}` : book.name}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.background },
              ]}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {selectedChapter ? "Select Verse" : "Select Chapter"}
          </Text>

          <ScrollView
            style={styles.numbersList}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.numbersGrid}>
              {!selectedChapter
                ? chapters.map((chapter) => (
                    <TouchableOpacity
                      key={chapter}
                      style={[
                        styles.numberCard,
                        {
                          backgroundColor: colors.primary,
                          shadowColor: colors.shadow,
                        },
                      ]}
                      onPress={() => handleChapterSelect(chapter)}
                    >
                      <Text
                        style={[
                          styles.numberText,
                          { color: colors.cardBackground },
                        ]}
                      >
                        {chapter}
                      </Text>
                    </TouchableOpacity>
                  ))
                : Array.from({ length: verseCount }, (_, i) => i + 1).map(
                    (verse) => (
                      <TouchableOpacity
                        key={verse}
                        style={[
                          styles.numberCard,
                          {
                            backgroundColor: colors.primary,
                            shadowColor: colors.shadow,
                          },
                        ]}
                        onPress={() => handleVerseSelect(verse)}
                      >
                        <Text
                          style={[
                            styles.numberText,
                            { color: colors.cardBackground },
                          ]}
                        >
                          {verse}
                        </Text>
                      </TouchableOpacity>
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
    height: "75%",
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
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    flex: 1,
    textAlign: "center" as const,
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
  subtitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  numbersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  numbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 20,
  },
  numberCard: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numberText: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
});
