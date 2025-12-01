import { VersionSelectorModal } from "@/components/version-selector-modal";
import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import {
  Bell,
  Book,
  ChevronRight,
  Database,
  FileText,
  Globe,
  Info,
  Moon,
  Settings as SettingsIcon,
  Trash2,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    settings,
    updateSettings,
    setDefaultVersion,
    preloadVersion,
    clearCache,
    resetAppData,
  } = useBibleStore();

  const [showVersionSelector, setShowVersionSelector] =
    useState<boolean>(false);

  const handleThemeToggle = (value: boolean) => {
    updateSettings({
      theme: value ? "dark" : "light",
    });
  };

  const handleNotificationsToggle = () => {
    updateSettings({
      notifications: !settings.notifications,
    });
  };

  const handleVersionSelect = async (versionId: string) => {
    setDefaultVersion(versionId);
    await preloadVersion(versionId);
  };

  const handleVersionChange = async (versionId: string) => {
    setDefaultVersion(versionId);
    setShowVersionSelector(false);
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear downloaded Bible versions and temporary data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => clearCache() },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset App Data",
      "This will reset all settings, notes, highlights, and favorites. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetAppData() },
      ]
    );
  };

  const handleVisitWebsite = () => {
    Linking.openURL("https://your-app-website.com");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <SettingsIcon size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Section */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <User size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Account
              </Text>
            </View>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Bible Reader
              </Text>
              <Text
                style={[styles.settingValue, { color: colors.textSecondary }]}
              >
                user@example.com
              </Text>
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/(profile)")}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Profile
              </Text>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          {/* Appearance Section */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Moon size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Switch
                value={settings.theme === "dark"}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.cardBackground}
              />
            </View>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Font Size
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                {settings.fontSize}
              </Text>
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Line Spacing
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                {settings.lineSpacing}
              </Text>
            </TouchableOpacity>
            {/* Add more like font family, reading mode */}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Reading Mode
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                Scroll
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reading Settings */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Book size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Reading
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowVersionSelector(true)}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Bible Version
              </Text>
              <Text style={[styles.settingValue, { color: colors.primary }]}>
                {settings.defaultBibleVersion.toUpperCase()}
              </Text>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Daily Goal
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                3 chapters
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Notifications
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Enable Notifications
              </Text>
              <Switch
                value={settings.notifications}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.cardBackground}
              />
            </View>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Daily Reminder Time
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                {settings.dailyReminderTime || "9:00 AM"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Data Management */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Database size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Data Management
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/profile/backup")}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Backup & Restore
              </Text>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleClearCache}
            >
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Clear Cache
              </Text>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleResetData}
            >
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Reset App Data
              </Text>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* Legal & About */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Info size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/(settings)/policy")}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Privacy Policy
              </Text>
              <FileText size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/(settings)/terms")}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Terms of Service
              </Text>
              <FileText size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/(settings)/about")}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                About App
              </Text>
              <Info size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleVisitWebsite}
            >
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Visit Website
              </Text>
              <Globe size={20} color={colors.textLight} />
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                App Version
              </Text>
              <Text style={[styles.settingValue, { color: colors.textLight }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>

        {/* Version Selector Modal */}
        <VersionSelectorModal
          visible={showVersionSelector}
          onClose={() => setShowVersionSelector(false)}
          currentVersion={settings.defaultBibleVersion}
          onVersionSelect={handleVersionChange}
        />
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
    borderBottomWidth: 1,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)", // Slight tint for header
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  // Removed unused styles for brevity, but kept improved ones
});
