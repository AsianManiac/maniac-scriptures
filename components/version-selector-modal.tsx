import { useTheme } from "@/hooks/use-theme";
import { getBibleVersions } from "@/utils/bible-api";
import { Check, X } from "lucide-react-native";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface VersionSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  currentVersion: string;
  onVersionSelect: (versionId: string) => void;
}

export function VersionSelectorModal({
  visible,
  onClose,
  currentVersion,
  onVersionSelect,
}: VersionSelectorModalProps) {
  const { colors } = useTheme();
  const bibleVersions = getBibleVersions();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
              Select Bible Version
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.background },
              ]}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.versionsList}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.versionsContent}>
              {bibleVersions.map((version) => (
                <TouchableOpacity
                  key={version.id}
                  style={[
                    styles.versionItem,
                    { backgroundColor: colors.background },
                    currentVersion === version.id && {
                      backgroundColor: colors.primaryLight,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => onVersionSelect(version.id)}
                >
                  <View style={styles.versionInfo}>
                    <Text
                      style={[
                        styles.versionName,
                        { color: colors.text },
                        currentVersion === version.id && {
                          color: colors.primaryDark,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {version.name}
                    </Text>
                    <Text
                      style={[
                        styles.versionDetails,
                        { color: colors.textSecondary },
                        currentVersion === version.id && {
                          color: colors.primaryDark,
                        },
                      ]}
                    >
                      {version.abbreviation} • {version.language}
                    </Text>
                  </View>

                  {currentVersion === version.id && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    height: "80%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  versionsList: {
    flex: 1,
  },
  versionsContent: {
    padding: 20,
  },
  versionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  versionInfo: {
    flex: 1,
  },
  versionName: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  versionDetails: {
    fontSize: 14,
  },
});
