import { NoteEditorModal } from "@/components/note-editor-modal";
import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { Note } from "@/types/bible";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Edit2,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notes, addNote, updateNote, deleteNote, navigateToVerse } =
    useBibleStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditor = () => {
    setEditingNote(null);
    setModalVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const saveNote = (note: Note) => {
    if (editingNote) {
      updateNote(note);
    } else {
      addNote(note);
    }
    setModalVisible(false);
  };

  const removeNote = (id: string) => {
    Alert.alert("Delete Note", "This note will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  const goToVerse = (note: Note) => {
    if (note.reference) {
      navigateToVerse(
        note.reference.book,
        note.reference.chapter,
        note.reference.verse
      );
      router.push("/(bible)");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FileText size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>My Notes</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchBar, { backgroundColor: colors.cardBackground }]}
      >
        <Search size={20} color={colors.textLight} />
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={colors.textLight}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.listContent}>
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={64} color={colors.textLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No notes yet
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Tap the + button to create your first note
              </Text>
            </View>
          ) : (
            filteredNotes.map((note) => (
              <View
                key={note.id}
                style={[
                  styles.noteCard,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <View style={styles.noteHeader}>
                  <Text
                    style={[styles.noteTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {note.title}
                  </Text>
                  <Text style={[styles.date, { color: colors.textLight }]}>
                    {new Date(
                      note.updatedAt || note.createdAt
                    ).toLocaleDateString()}
                  </Text>
                </View>

                <Text
                  style={[styles.preview, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {note.content || "No content"}
                </Text>

                {note.reference && (
                  <TouchableOpacity
                    style={styles.refRow}
                    onPress={() => goToVerse(note)}
                  >
                    <BookOpen size={16} color={colors.primary} />
                    <Text style={[styles.refText, { color: colors.primary }]}>
                      {note.reference.book} {note.reference.chapter}:
                      {note.reference.verse}
                    </Text>
                  </TouchableOpacity>
                )}

                {note.tags.length > 0 && (
                  <View style={styles.tags}>
                    {note.tags.map((tag) => (
                      <View
                        key={tag}
                        style={[
                          styles.tag,
                          { backgroundColor: colors.primaryLight },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            { color: colors.primaryDark },
                          ]}
                        >
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => openEdit(note)}
                    style={styles.iconBtn}
                  >
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeNote(note.id)}
                    style={styles.iconBtn}
                  >
                    <Trash2 size={20} color={colors.error || "#E57373"} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating + Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={openEditor}
      >
        <Plus size={30} color={colors.cardBackground} />
      </TouchableOpacity>

      {/* Editor Modal */}
      <NoteEditorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveNote}
        existingNote={editingNote || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 32, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 100 },
  emptyState: { alignItems: "center", paddingTop: 80 },
  emptyTitle: { fontSize: 22, fontWeight: "700", marginTop: 16 },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 8 },
  noteCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  noteTitle: { fontSize: 18, fontWeight: "700", flex: 1, marginRight: 12 },
  date: { fontSize: 12 },
  preview: { fontSize: 15, lineHeight: 22, marginBottom: 12 },
  refRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  refText: { fontSize: 14, fontWeight: "600" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: "600" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 20 },
  iconBtn: { padding: 6 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
