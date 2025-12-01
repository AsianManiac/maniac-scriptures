import { useTheme } from "@/hooks/use-theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our Bible Reader app.
          </Text>
          {/* Add full policy text here */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Information We Collect
          </Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            We may collect information about you in a variety of ways, including
            personal information you provide to us.
          </Text>
          {/* More sections... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
