import { useTheme } from "@/hooks/use-theme";
import { Note, VerseReference } from "@/types/bible";
import { Save, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NoteEditorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  verseReference?: VerseReference;
  existingNote?: Note;
}

export function NoteEditorModal({
  visible,
  onClose,
  onSave,
  verseReference,
  existingNote,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const { colors } = useTheme();

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags.join(", "));
    } else {
      setTitle("");
      setContent("");
      setTags("");
    }
  }, [existingNote, visible]);

  const handleSave = () => {
    const note: Note = {
      id: existingNote?.id || `note-${Date.now()}`,
      reference: verseReference,
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Saving note:", note);
    onSave(note);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
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
              {existingNote ? "Edit Note" : "New Note"}
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  styles.closeButton,
                  { backgroundColor: colors.background },
                ]}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {verseReference && (
            <View
              style={[
                styles.verseReferenceCard,
                {
                  backgroundColor: colors.primaryLight,
                  borderLeftColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.verseReferenceLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Verse Reference
              </Text>
              <Text style={[styles.verseReferenceText, { color: colors.text }]}>
                {verseReference.book} {verseReference.chapter}:
                {verseReference.verse}
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[
                  styles.titleInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter note title..."
                placeholderTextColor={colors.textLight}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[
                  styles.contentInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Write your notes here..."
                placeholderTextColor={colors.textLight}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tags (comma separated)</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="prayer, faith, hope..."
                placeholderTextColor={colors.textLight}
                value={tags}
                onChangeText={setTags}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary, shadowColor: colors.shadow },
            ]}
            onPress={handleSave}
          >
            <Save size={20} color={colors.cardBackground} />
            <Text
              style={[styles.saveButtonText, { color: colors.cardBackground }]}
            >
              Save Note
            </Text>
          </TouchableOpacity>
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
    maxHeight: "90%",
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
    fontSize: 24,
    fontWeight: "700" as const,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verseReferenceCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  verseReferenceLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  verseReferenceText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  titleInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  contentInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 200,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
