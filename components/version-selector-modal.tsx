import {
  ALL_BIBLE_VERSIONS,
  RemoteBibleVersion,
} from "@/constants/bible-versions-config";
import { useTheme } from "@/hooks/use-theme";
import { useBibleStore } from "@/stores/bible-store";
import { Check, Download, Trash2, X } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CircularProgress } from "./ui/circular-progress";

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
  const {
    downloadedVersions,
    downloadingVersions,
    downloadVersion,
    downloadProgress,
    deleteVersion,
    checkDownloadedVersions,
  } = useBibleStore();

  useEffect(() => {
    if (visible) {
      checkDownloadedVersions();
    }
  }, [visible]);

  const handleDownload = async (version: RemoteBibleVersion) => {
    try {
      await downloadVersion(version.id);
    } catch (e) {
      Alert.alert(
        "Download Failed",
        "Could not download this version. Check internet connection."
      );
    }
  };

  const handleDelete = (version: RemoteBibleVersion) => {
    Alert.alert(
      "Delete Version",
      `Are you sure you want to delete ${version.abbreviation}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteVersion(version.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: RemoteBibleVersion }) => {
    const isDownloaded = downloadedVersions.includes(item.id);
    const isDownloading = downloadingVersions[item.id];
    const progressData = downloadProgress[item.id];
    const isSelected = currentVersion === item.id;
    const isStatic = item.isStatic;

    return (
      <View
        style={[styles.itemContainer, { borderBottomColor: colors.border }]}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() =>
            isDownloaded ? onVersionSelect(item.id) : handleDownload(item)
          }
          disabled={isDownloading}
        >
          <View>
            <Text style={[styles.itemAbbr, { color: colors.text }]}>
              {item.abbreviation}
            </Text>
            <Text style={[styles.itemName, { color: colors.textSecondary }]}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionContainer}>
          {isDownloading ? (
            <CircularProgress
              progress={progressData?.progress || 0}
              size={28}
              color={colors.primary}
            />
          ) : isSelected ? (
            <Check size={20} color={colors.primary} />
          ) : isDownloaded ? (
            !isStatic ? (
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.iconBtn}
              >
                <Trash2 size={20} color={colors.error || "#ff4444"} />
              </TouchableOpacity>
            ) : null
          ) : (
            <TouchableOpacity
              onPress={() => handleDownload(item)}
              style={styles.iconBtn}
            >
              <Download size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Sort: Downloaded first, then alphabetical
  const sortedVersions = [...ALL_BIBLE_VERSIONS].sort((a, b) => {
    const aDownloaded = downloadedVersions.includes(a.id);
    const bDownloaded = downloadedVersions.includes(b.id);
    if (aDownloaded && !bDownloaded) return -1;
    if (!aDownloaded && bDownloaded) return 1;
    return a.abbreviation.localeCompare(b.abbreviation);
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
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

          <FlatList
            data={sortedVersions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
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
  listContent: { paddingBottom: 40 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemContent: { flex: 1 },
  itemAbbr: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  itemName: { fontSize: 14 },
  actionContainer: { paddingLeft: 12 },
  iconBtn: { padding: 8 },
});
