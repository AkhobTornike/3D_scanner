import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "../constants";
import { Model3D } from "../types/model.types";
import {
  deleteModel,
  getAllModels,
  getStorageStats,
} from "../services/storageService";
import { ScreenProps } from "../navigation/types";
import { ModelCard } from "../components";

type Props = ScreenProps<"Gallery">;

export const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ count: 0, totalSize: 0 });

  const loadModels = async () => {
    try {
      const allModels = await getAllModels();
      const storageStats = await getStorageStats();

      setModels(allModels);
      setStats(storageStats);
    } catch (err) {
      console.error("Error loading models:", err);
      Alert.alert("შეცდომა", "მოდელების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadModels();
  }, []);

  const handleModelPress = (model: Model3D) => {
    navigation.navigate("Preview", {
      modelId: model.id,
      modelPath: model.filePath,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async (model: Model3D) => {
    try {
      await deleteModel(model.id);
      await loadModels();
      Alert.alert("წარმატება", "მოდელი წაიშალა");
    } catch (err) {
      console.error("Error deleting model:", err);
      Alert.alert("შეცდომა", "მოდელის წაშლა ვერ მოხერხდა");
    }
  };

  const renderModelCard = ({ item }: { item: Model3D }) => (
    <ModelCard
      model={item}
      onPress={handleModelPress}
      onDelete={handleDelete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>მოდელები არ არის</Text>
      <Text style={styles.emptyText}>
        დაიწყეთ ობიექტის სკანირება და შექმენით თქვენი პირველი 3D მოდელი!
      </Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={styles.startButtonText}>დაწყება</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>გალერეა</Text>
      <Text style={styles.headerStats}>
        {stats.count} მოდელი • {formatFileSize(stats.totalSize)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>იტვირთება...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={models}
        renderItem={renderModelCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          models.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerStats: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    margin: 10,
    overflow: "hidden",
    maxWidth: "48%",
  },
  thumbnail: {
    width: "100%",
    height: 150,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailIcon: {
    fontSize: 60,
  },
  cardInfo: {
    padding: 12,
  },
  modelName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  modelFormat: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  modelSize: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  modelDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  startButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
