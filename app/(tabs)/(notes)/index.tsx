import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { FileText, Plus, Search } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotesScreen() {
  const { notes } = useBibleStore();
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <FileText size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Notes</Text>
        </View>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search notes..."
          placeholderTextColor={colors.textLight}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={64} color={colors.textLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Notes Yet
              </Text>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                Start taking notes on your favorite verses
              </Text>
            </View>
          ) : (
            notes.map((note: any) => (
              <TouchableOpacity
                key={note.id}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: colors.cardBackground,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <View style={styles.noteHeader}>
                  <Text style={[styles.noteTitle, { color: colors.text }]}>
                    {note.title}
                  </Text>
                  <Text style={[styles.noteDate, { color: colors.textLight }]}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[styles.noteContent, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {note.content}
                </Text>
                {note.reference && (
                  <Text
                    style={[styles.noteReference, { color: colors.primary }]}
                  >
                    {note.reference.book} {note.reference.chapter}:
                    {note.reference.verse}
                  </Text>
                )}
                {note.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {note.tags.map((tag: string) => (
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
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.primary, shadowColor: colors.shadow },
        ]}
      >
        <Plus size={28} color={colors.cardBackground} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center" as const,
  },
  noteCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700" as const,
    marginRight: 12,
  },
  noteDate: {
    fontSize: 12,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  noteReference: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  addButton: {
    position: "absolute" as const,
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
