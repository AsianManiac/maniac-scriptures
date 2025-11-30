import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { Note, VerseReference } from "@/types/bible";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import {
  Copy,
  FileText,
  Heart,
  Highlighter,
  Share2,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteEditorModal } from "./note-editor-modal";

interface VerseActionsProps {
  verse: VerseReference;
  verseText: string;
  visible: boolean;
  onClose: () => void;
}

export function VerseActionsSheet({
  verse,
  verseText,
  visible,
  onClose,
}: VerseActionsProps) {
  const {
    addHighlight,
    removeHighlight,
    getHighlightForVerse,
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
    getFavoriteId,
    addNote,
    updateNote,
  } = useBibleStore();
  const { colors } = useTheme();

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showNoteEditor, setShowNoteEditor] = useState<boolean>(false);

  const currentHighlight = getHighlightForVerse(verse);
  const isVerseHighlighted = !!currentHighlight;
  const isVerseFavorite = checkIsFavorite(verse);

  const highlightColors = [
    { name: "yellow", color: colors.highlightYellow },
    { name: "green", color: colors.highlightGreen },
    { name: "blue", color: colors.highlightBlue },
    { name: "pink", color: colors.highlightPink },
    { name: "orange", color: colors.highlightOrange },
  ];

  const handleHighlight = (colorName: string) => {
    if (isVerseHighlighted && currentHighlight) {
      removeHighlight(currentHighlight.id);
    }
    addHighlight({
      id: `highlight-${verse.book}-${verse.chapter}-${
        verse.verse
      }-${Date.now()}`,
      reference: verse,
      color: colorName,
      createdAt: new Date().toISOString(),
    });
    setShowColorPicker(false);
    onClose();
  };

  const handleRemoveHighlight = () => {
    if (currentHighlight) {
      removeHighlight(currentHighlight.id);
    }
    setShowColorPicker(false);
    onClose();
  };

  const handleFavorite = () => {
    if (isVerseFavorite) {
      const favoriteId = getFavoriteId(verse);
      if (favoriteId) {
        removeFavorite(favoriteId);
      }
    } else {
      addFavorite({
        id: `favorite-${verse.book}-${verse.chapter}-${
          verse.verse
        }-${Date.now()}`,
        reference: verse,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const handleAddNote = () => {
    setShowNoteEditor(true);
  };

  const handleSaveNote = (note: Note) => {
    if (note.createdAt === note.updatedAt) {
      addNote(note);
    } else {
      updateNote(note);
    }
  };

  const handleCopy = async () => {
    try {
      const formattedText = `${verse.book} ${verse.chapter}:${verse.verse}\n\n${verseText}`;
      await Clipboard.setStringAsync(formattedText);

      if (Platform.OS !== "web") {
        Alert.alert("Copied!", "Verse copied to clipboard");
      }
      console.log("Verse copied to clipboard");
      onClose();
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy verse");
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `${verse.book} ${verse.chapter}:${verse.verse}\n\n${verseText}`;

      if (Platform.OS === "ios" || Platform.OS === "android") {
        // Use native sharing on mobile
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(shareText, {
            dialogTitle: `Share ${verse.book} ${verse.chapter}:${verse.verse}`,
            mimeType: "text/plain",
          });
        } else {
          // Fallback to clipboard if sharing is not available
          await Clipboard.setStringAsync(shareText);
          Alert.alert("Copied!", "Verse copied to clipboard");
        }
      } else {
        // Web platform - use navigator.share or fallback to clipboard
        if (navigator.share) {
          await navigator.share({
            title: `${verse.book} ${verse.chapter}:${verse.verse}`,
            text: shareText,
          });
        } else {
          await Clipboard.setStringAsync(shareText);
          Alert.alert("Copied!", "Verse copied to clipboard");
        }
      }

      onClose();
    } catch (error) {
      console.error("Error sharing verse:", error);
      // Don't show error for user cancellation
      if (error instanceof Error && !error.message.includes("cancelled")) {
        Alert.alert("Error", "Failed to share verse");
      }
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.cardBackground }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={[styles.verseRef, { color: colors.primary }]}>
                {verse.book} {verse.chapter}:{verse.verse}
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

            <Text
              style={[
                styles.verseTextDisplay,
                { color: colors.text, backgroundColor: colors.background },
              ]}
            >
              {verseText}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowColorPicker(!showColorPicker)}
              >
                <Highlighter size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Highlight
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleAddNote}
              >
                <FileText size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Note
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleFavorite}
              >
                <Heart
                  size={24}
                  color={colors.primary}
                  fill={isVerseFavorite ? colors.primary : "transparent"}
                />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  {isVerseFavorite ? "Unfavorite" : "Favorite"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCopy}
              >
                <Copy size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  Copy
                </Text>
              </TouchableOpacity>
            </View>

            {showColorPicker && (
              <View
                style={[styles.colorPicker, { borderTopColor: colors.border }]}
              >
                <Text style={[styles.colorPickerTitle, { color: colors.text }]}>
                  Choose Highlight Color
                </Text>
                <View style={styles.colorOptions}>
                  {highlightColors.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: item.color,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => handleHighlight(item.name)}
                    />
                  ))}
                </View>
                {isVerseHighlighted && (
                  <TouchableOpacity
                    style={[
                      styles.removeButton,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={handleRemoveHighlight}
                  >
                    <Text
                      style={[
                        styles.removeButtonText,
                        { color: colors.cardBackground },
                      ]}
                    >
                      Remove Highlight
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <NoteEditorModal
        visible={showNoteEditor}
        onClose={() => setShowNoteEditor(false)}
        onSave={handleSaveNote}
        verseReference={verse}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  verseRef: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verseTextDisplay: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    width: "18%",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 8,
    textAlign: "center" as const,
  },
  colorPicker: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  removeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
});
