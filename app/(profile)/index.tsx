import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import {
  Bell,
  ChevronRight,
  Database,
  Moon,
  Settings,
  Sun,
  Type,
  User,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { settings, updateSettings } = useBibleStore();

  const handleThemeToggle = () => {
    updateSettings({
      ...settings,
      theme: settings.theme === "light" ? "dark" : "light",
    });
  };

  const handleNotificationsToggle = () => {
    updateSettings({
      ...settings,
      notifications: !settings.notifications,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <User size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <View
              style={[
                styles.profileAvatar,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <User size={40} color={colors.primary} />
            </View>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Bible Reader
            </Text>
            <Text
              style={[styles.profileEmail, { color: colors.textSecondary }]}
            >
              Continue your daily devotion
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Reading Settings
            </Text>

            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Type size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Font Size
                  </Text>
                </View>
                <View style={styles.fontSizeControls}>
                  <TouchableOpacity
                    style={[
                      styles.fontButton,
                      { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() =>
                      updateSettings({
                        ...settings,
                        fontSize: Math.max(12, settings.fontSize - 2),
                      })
                    }
                  >
                    <Text
                      style={[styles.fontButtonText, { color: colors.primary }]}
                    >
                      A-
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.fontSizeValue, { color: colors.text }]}>
                    {settings.fontSize}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.fontButton,
                      { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() =>
                      updateSettings({
                        ...settings,
                        fontSize: Math.min(24, settings.fontSize + 2),
                      })
                    }
                  >
                    <Text
                      style={[styles.fontButtonText, { color: colors.primary }]}
                    >
                      A+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              App Settings
            </Text>

            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  {settings.theme === "light" ? (
                    <Sun size={20} color={colors.primary} />
                  ) : (
                    <Moon size={20} color={colors.primary} />
                  )}
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={settings.theme === "dark"}
                  onValueChange={handleThemeToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.cardBackground}
                />
              </View>

              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Daily Reminders
                  </Text>
                </View>
                <Switch
                  value={settings.notifications}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.cardBackground}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Data
            </Text>

            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Database size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Backup & Restore
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              About
            </Text>

            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: colors.cardBackground,
                  shadowColor: colors.shadow,
                },
              ]}
            >
              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Settings size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Version
                  </Text>
                </View>
                <Text
                  style={[styles.settingValue, { color: colors.textLight }]}
                >
                  1.0.0
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  settingCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  settingValue: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  fontSizeControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fontButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  fontButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  fontSizeValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    minWidth: 32,
    textAlign: "center" as const,
  },
});
