import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { BIBLE_BOOKS, fetchChapter } from "@/utils/bible-api";
import { useRouter } from "expo-router";
import { BookOpen, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export default function BibleSearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { navigateToVerse } = useBibleStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const searchBible = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    console.log("Searching for:", query);

    try {
      const results: SearchResult[] = [];
      const searchLower = query.toLowerCase();

      const booksToSearch = BIBLE_BOOKS.slice(0, 10);

      for (const book of booksToSearch) {
        for (
          let chapterNum = 1;
          chapterNum <= Math.min(book.chapters, 5);
          chapterNum++
        ) {
          try {
            const verses = await fetchChapter(book.id, book.name, chapterNum);

            verses.forEach((verse) => {
              if (verse.text.toLowerCase().includes(searchLower)) {
                results.push({
                  book: verse.book,
                  chapter: verse.chapter,
                  verse: verse.verse,
                  text: verse.text,
                });
              }
            });

            if (results.length >= 50) {
              break;
            }
          } catch (error) {
            console.error(`Error fetching ${book.name} ${chapterNum}:`, error);
          }
        }

        if (results.length >= 50) {
          break;
        }
      }

      console.log(`Found ${results.length} results`);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    searchBible(searchQuery);
  };

  const handleResultPress = (result: SearchResult) => {
    console.log("Result pressed:", result);
    navigateToVerse(result.book, result.chapter, result.verse);
    router.push("/(tabs)/(bible)");
  };

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts: React.JSX.Element[] = [];
    const searchLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    let lastIndex = 0;
    let index = 0;

    while ((index = textLower.indexOf(searchLower, lastIndex)) !== -1) {
      if (index > lastIndex) {
        parts.push(
          <Text
            key={`text-${lastIndex}`}
            style={[styles.resultText, { color: colors.text }]}
          >
            {text.substring(lastIndex, index)}
          </Text>
        );
      }

      parts.push(
        <Text
          key={`highlight-${index}`}
          style={[
            styles.highlightedText,
            { backgroundColor: colors.primary, color: colors.cardBackground },
          ]}
        >
          {text.substring(index, index + query.length)}
        </Text>
      );

      lastIndex = index + query.length;
    }

    if (lastIndex < text.length) {
      parts.push(
        <Text
          key={`text-${lastIndex}`}
          style={[styles.resultText, { color: colors.text }]}
        >
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return <Text>{parts}</Text>;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Bible verses..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text
            style={[styles.searchButtonText, { color: colors.cardBackground }]}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Searching Bible...
          </Text>
        </View>
      ) : hasSearched && searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Search size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Results Found
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            We couldn&apos;t find any verses matching &ldquo;{searchQuery}
            &rdquo;.{"\n"}Try different keywords or phrases.
          </Text>
        </View>
      ) : !hasSearched ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <BookOpen size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Search the Bible
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            Enter keywords or phrases to find verses throughout the Bible.
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={[styles.examplesTitle, { color: colors.text }]}>
              Try searching for:
            </Text>
            {["love", "faith", "hope", "peace"].map((term) => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.exampleChip,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  setSearchQuery(term);
                  searchBible(term);
                }}
              >
                <Text
                  style={[styles.exampleChipText, { color: colors.primary }]}
                >
                  {term}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsCount, { color: colors.text }]}>
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </Text>
          </View>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
              style={[
                styles.resultCard,
                { backgroundColor: colors.cardBackground },
              ]}
              onPress={() => handleResultPress(result)}
            >
              <View style={styles.resultHeader}>
                <View
                  style={[
                    styles.resultBadge,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultBadgeText,
                      { color: colors.primaryDark },
                    ]}
                  >
                    {result.book} {result.chapter}:{result.verse}
                  </Text>
                </View>
                <BookOpen size={16} color={colors.primary} />
              </View>
              <View style={styles.resultContent}>
                {highlightSearchTerms(result.text, searchQuery)}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  emptyDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center" as const,
    marginBottom: 32,
  },
  examplesContainer: {
    alignItems: "center",
    gap: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  exampleChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  exampleChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  resultContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
  },
  highlightedText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700" as const,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});
