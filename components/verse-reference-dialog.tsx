import { useTheme } from "@/hooks/use-theme";
import { Verse } from "@/types/bible";
import { fetchChapter, getBook } from "@/utils/bible-api";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, X } from "lucide-react-native";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface VerseReferenceDialogProps {
  visible: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  verse: number;
  onGoToVerse?: () => void;
}

export function VerseReferenceDialog({
  visible,
  onClose,
  book,
  chapter,
  verse,
  onGoToVerse,
}: VerseReferenceDialogProps) {
  const { colors } = useTheme();

  const bookData = getBook(book);

  const {
    data: verses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["verse-dialog", bookData?.id, bookData?.name, chapter],
    queryFn: async () => {
      if (!bookData) return [];
      return await fetchChapter(bookData.id, bookData.name, chapter);
    },
    enabled: !!bookData && visible,
    staleTime: Infinity,
  });

  const targetVerse = verses?.find((v: Verse) => v.verse === verse);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[styles.dialog, { backgroundColor: colors.cardBackground }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {book} {chapter}:{verse}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={true}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={[styles.loadingText, { color: colors.textSecondary }]}
                >
                  Loading verse...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.error }]}>
                  Failed to load verse
                </Text>
              </View>
            ) : targetVerse ? (
              <View>
                <View
                  style={[
                    styles.verseContainer,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text
                    style={[styles.verseNumber, { color: colors.primaryDark }]}
                  >
                    {verse}
                  </Text>
                  <Text style={[styles.verseText, { color: colors.text }]}>
                    {targetVerse.text}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text
                  style={[styles.errorText, { color: colors.textSecondary }]}
                >
                  Verse not found
                </Text>
              </View>
            )}
          </ScrollView>

          {targetVerse && onGoToVerse && (
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.goToButton, { backgroundColor: colors.primary }]}
                onPress={onGoToVerse}
              >
                <ExternalLink size={18} color={colors.cardBackground} />
                <Text
                  style={[
                    styles.goToButtonText,
                    { color: colors.cardBackground },
                  ]}
                >
                  Read in Bible
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialog: {
    width: "90%",
    maxHeight: "70%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  verseContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: "700" as const,
    marginTop: 2,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  goToButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  goToButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
});
