import { useTheme } from "@/hooks/use-theme";
import { Book } from "@/types/bible";
import { getNewTestamentBooks, getOldTestamentBooks } from "@/utils/bible-api";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BookSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
  currentBook?: string;
}

export function BookSelectorModal({
  visible,
  onClose,
  onSelectBook,
  currentBook,
}: BookSelectorModalProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"old" | "new">("new");

  const oldTestamentBooks = getOldTestamentBooks();
  const newTestamentBooks = getNewTestamentBooks();

  const displayBooks =
    activeTab === "old" ? oldTestamentBooks : newTestamentBooks;

  const handleBookSelect = (book: Book) => {
    onSelectBook(book);
    onClose();
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
            <Text style={[styles.title, { color: colors.text }]}>
              Select Book
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

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                { backgroundColor: colors.background },
                activeTab === "old" && {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setActiveTab("old")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textSecondary },
                  activeTab === "old" && {
                    color: colors.text,
                    fontWeight: "700" as const,
                  },
                ]}
              >
                Old Testament
              </Text>
              <Text
                style={[
                  styles.tabCount,
                  { color: colors.textLight },
                  activeTab === "old" && { color: colors.primary },
                ]}
              >
                {oldTestamentBooks.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                { backgroundColor: colors.background },
                activeTab === "new" && {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setActiveTab("new")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textSecondary },
                  activeTab === "new" && {
                    color: colors.text,
                    fontWeight: "700" as const,
                  },
                ]}
              >
                New Testament
              </Text>
              <Text
                style={[
                  styles.tabCount,
                  { color: colors.textLight },
                  activeTab === "new" && { color: colors.primary },
                ]}
              >
                {newTestamentBooks.length}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.booksList}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.booksGrid}>
              {displayBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={[
                    styles.bookCard,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                    currentBook === book.name && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primaryDark,
                    },
                  ]}
                  onPress={() => handleBookSelect(book)}
                >
                  <Text
                    style={[
                      styles.bookName,
                      { color: colors.text },
                      currentBook === book.name && {
                        color: colors.cardBackground,
                      },
                    ]}
                  >
                    {book.name}
                  </Text>
                  <Text
                    style={[
                      styles.bookChapters,
                      { color: colors.textSecondary },
                      currentBook === book.name && {
                        color: colors.cardBackground,
                        opacity: 0.9,
                      },
                    ]}
                  >
                    {book.chapters}{" "}
                    {book.chapters === 1 ? "chapter" : "chapters"}
                  </Text>
                </TouchableOpacity>
              ))}
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
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  tabCount: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  booksList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 20,
  },
  bookCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  bookName: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
});
