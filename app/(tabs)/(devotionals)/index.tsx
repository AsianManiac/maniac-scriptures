import Colors from "@/constants/colors";
import { DEVOTIONALS } from "@/data/bible-data";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { BookOpen, Heart } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevotionalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const categories = ["All", "Faith", "Wisdom", "Prayer", "Love", "Grace"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.titleContainer}>
          <Heart size={28} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Devotionals
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              category === "All" && styles.categoryChipActive,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === "All" && styles.categoryTextActive,
                { color: colors.text },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {DEVOTIONALS.map((devotional) => (
            <TouchableOpacity
              key={devotional.id}
              style={[
                styles.devotionalCard,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() =>
                router.push(`/(tabs)/(devotionals)/${devotional.id}` as any)
              }
            >
              <View style={styles.devotionalHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>
                    {devotional.category}
                  </Text>
                </View>
                <Text
                  style={[styles.devotionalDate, { color: colors.textLight }]}
                >
                  {devotional.date}
                </Text>
              </View>

              <Text style={styles.devotionalTitle}>{devotional.title}</Text>
              <Text
                style={[
                  styles.devotionalContent,
                  { color: colors.textSecondary },
                ]}
                numberOfLines={3}
              >
                {devotional.content}
              </Text>

              <View style={styles.verseReferenceContainer}>
                <BookOpen size={16} color={colors.primary} />
                <Text
                  style={[styles.verseReferenceText, { color: colors.primary }]}
                >
                  {devotional.verseReference.book}{" "}
                  {devotional.verseReference.chapter}:
                  {devotional.verseReference.verse}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: 60,
  },
  categoryChip: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  categoryTextActive: {
    color: Colors.light.cardBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  devotionalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  devotionalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.light.primaryDark,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  devotionalDate: {
    fontSize: 12,
  },
  devotionalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  devotionalContent: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  verseReferenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verseReferenceText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
