import { useTheme } from "@/hooks/use-theme";
import { Note, VerseReference } from "@/types/bible";
import { Hash, Save, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  existingNote?: Note;
  verseReference?: VerseReference;
}

export function NoteEditorModal({
  visible,
  onClose,
  onSave,
  existingNote,
  verseReference,
}: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

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
    if (!title.trim() && !content.trim()) return;

    const note: Note = {
      id: existingNote?.id || `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      reference: verseReference || existingNote?.reference,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(note);
    onClose();
  };

  const close = () => {
    setTitle("");
    setContent("");
    setTags("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <View
            style={[styles.modal, { backgroundColor: colors.cardBackground }]}
          >
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {existingNote ? "Edit Note" : "New Note"}
              </Text>
              <TouchableOpacity onPress={close} style={styles.closeBtn}>
                <X size={26} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Verse Reference */}
            {verseReference && (
              <View
                style={[
                  styles.refCard,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text style={[styles.refLabel, { color: colors.primaryDark }]}>
                  Linked Verse
                </Text>
                <Text style={[styles.refText, { color: colors.primaryDark }]}>
                  {verseReference.book} {verseReference.chapter}:
                  {verseReference.verse}
                </Text>
              </View>
            )}

            {/* Scrollable Content */}
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Title
                </Text>
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
                  autoFocus={!existingNote}
                />
              </View>

              {/* Content - Now HUGE and scrollable */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Your Note
                </Text>
                <TextInput
                  style={[
                    styles.contentInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      minHeight: 280, // ← This is the fix!
                      paddingTop: 16,
                    },
                  ]}
                  placeholder="Start writing your thoughts, reflections, prayers..."
                  placeholderTextColor={colors.textLight}
                  multiline
                  textAlignVertical="top"
                  value={content}
                  onChangeText={setContent}
                />
              </View>

              {/* Tags */}
              <View style={styles.field}>
                <View style={styles.tagHeader}>
                  <Hash size={18} color={colors.textSecondary} />
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Tags (comma separated)
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.tagInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="e.g. faith, prayer, encouragement"
                  placeholderTextColor={colors.textLight}
                  value={tags}
                  onChangeText={setTags}
                />
              </View>
            </ScrollView>

            {/* Save Button - Fixed at bottom */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Save size={22} color={colors.cardBackground} />
                <Text
                  style={[styles.saveText, { color: colors.cardBackground }]}
                >
                  {existingNote ? "Update Note" : "Save Note"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modal: {
    height: "92%", // Takes almost full screen
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  closeBtn: { padding: 6 },
  refCard: {
    marginHorizontal: 24,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
  },
  refLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  refText: { fontSize: 17, fontWeight: "700", marginTop: 6 },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  field: { marginHorizontal: 24, marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 10 },

  titleInput: {
    fontSize: 19,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },

  contentInput: {
    fontSize: 17,
    lineHeight: 26,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    textAlignVertical: "top",
  },

  tagHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  tagInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "transparent",
  },
  saveBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  saveText: { fontSize: 18, fontWeight: "700" },
});
