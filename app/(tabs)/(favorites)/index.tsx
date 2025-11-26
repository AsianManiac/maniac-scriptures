import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { BIBLE_BOOKS, fetchChapter } from "@/utils/bible-api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { BookOpen, Calendar, Heart, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SortOption = "bible" | "date";

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { favorites, removeFavorite, navigateToVerse } = useBibleStore();
  const [sortBy, setSortBy] = useState<SortOption>("bible");

  const sortedFavorites = useMemo(() => {
    if (sortBy === "date") {
      return [...favorites].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return [...favorites].sort((a, b) => {
        const bookAIndex = BIBLE_BOOKS.findIndex(
          (book) => book.name === a.reference.book
        );
        const bookBIndex = BIBLE_BOOKS.findIndex(
          (book) => book.name === b.reference.book
        );

        if (bookAIndex !== bookBIndex) {
          return bookAIndex - bookBIndex;
        }

        if (a.reference.chapter !== b.reference.chapter) {
          return a.reference.chapter - b.reference.chapter;
        }

        return a.reference.verse - b.reference.verse;
      });
    }
  }, [favorites, sortBy]);

  const handleFavoritePress = (favorite: any) => {
    navigateToVerse(
      favorite.reference.book,
      favorite.reference.chapter,
      favorite.reference.verse
    );
    router.push("/(tabs)/(bible)");
  };

  const handleRemoveFavorite = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Heart size={28} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
          Sort by:
        </Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sortBy === "bible" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSortBy("bible")}
          >
            <BookOpen
              size={16}
              color={
                sortBy === "bible" ? colors.cardBackground : colors.primary
              }
            />
            <Text
              style={[
                styles.filterButtonText,
                sortBy === "bible" && { color: colors.cardBackground },
                { color: colors.primary },
              ]}
            >
              Bible Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sortBy === "date" && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setSortBy("date")}
          >
            <Calendar
              size={16}
              color={sortBy === "date" ? colors.cardBackground : colors.primary}
            />
            <Text
              style={[
                styles.filterButtonText,
                sortBy === "date" && { color: colors.cardBackground },
              ]}
            >
              Date Added
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {sortedFavorites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Heart size={64} color={colors.textLight} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Favorites Yet
              </Text>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                Start favoriting verses from the Bible reader
              </Text>
            </View>
          ) : (
            sortedFavorites.map((favorite) => (
              <FavoriteVerseCard
                key={favorite.id}
                favorite={favorite}
                onPress={() => handleFavoritePress(favorite)}
                onRemove={(e) => handleRemoveFavorite(favorite.id, e)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface FavoriteVerseCardProps {
  favorite: any;
  onPress: () => void;
  onRemove: (e: any) => void;
}

function FavoriteVerseCard({
  favorite,
  onPress,
  onRemove,
}: FavoriteVerseCardProps) {
  const { colors } = useTheme();
  const book = BIBLE_BOOKS.find((b) => b.name === favorite.reference.book);

  const { data: verses, isLoading } = useQuery({
    queryKey: ["bible", book?.id, book?.name, favorite.reference.chapter, book],
    queryFn: async () => {
      if (!book) return [];
      return await fetchChapter(book.id, book.name, favorite.reference.chapter);
    },
    enabled: !!book,
    staleTime: Infinity,
  });

  const verse = verses?.find((v) => v.verse === favorite.reference.verse);

  return (
    <Pressable
      style={[
        styles.favoriteCard,
        { shadowColor: colors.shadow, backgroundColor: colors.cardBackground },
      ]}
      onPress={onPress}
    >
      <View style={styles.favoriteHeader}>
        <Text style={[styles.favoriteReference, { color: colors.primary }]}>
          {favorite.reference.book} {favorite.reference.chapter}:
          {favorite.reference.verse}
        </Text>
        <TouchableOpacity
          onPress={onRemove}
          style={[styles.removeButton, { backgroundColor: colors.background }]}
        >
          <X size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <Text
          style={[styles.favoriteText, { color: colors.text }]}
          numberOfLines={3}
        >
          {verse?.text || "Verse not available"}
        </Text>
      )}

      <Text style={[styles.favoriteDate, { color: colors.textLight }]}>
        Added {new Date(favorite.createdAt).toLocaleDateString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  // filterButtonActive: {
  //   backgroundColor: Colors.light.primary,
  //   borderColor: Colors.light.primary,
  // },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  // filterButtonTextActive: {
  //   color: Colors.light.cardBackground,
  // },
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
  favoriteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  favoriteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  favoriteReference: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  favoriteText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  favoriteDate: {
    fontSize: 12,
  },
});
