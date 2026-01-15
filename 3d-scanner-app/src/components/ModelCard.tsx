import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { COLORS } from '../constants';
import { Model3D } from '../types/model.types';

interface ModelCardProps {
    model: Model3D;
    onPress: (model: Model3D) => void;
    onDelete?: (model: Model3D) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
    model,
    onPress,
    onDelete,
}) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handledelete = () => {
        Alert.alert(
            'წაშლა',
            `ნამდვილად გსურთ "${model.name}" მოდელის წაშლა?`,
            [
                { text: 'გაუქმება', style: 'cancel' },
                {
                    text: 'წაშლა',
                    style: 'destructive',
                    onPress: () => {
                        if (onDelete) {
                            onDelete(model);
                        }
                    },
                },
            ]
        );
    }

    return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPress(model)}
          activeOpacity={0.7}
        >
            {/* Delete button (top-right) */}
            {onDelete && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handledelete}
                  activeOpacity={0.7}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            )}

            {/* Thumbnail placeholder */}
            <View style={styles.thumbnail}>
                <Text style={styles.thumbnailIcon}>📦</Text>
            </View>

            {/* Model info */}
            <View style={styles.cardInfo}>
                <Text style={styles.modelName} numberOfLines={1}>
                    {model.name}
                </Text>
                <Text style={styles.modelFormat}>{model.format.toUpperCase()}</Text>
                <Text style={styles.modelSize}>{formatFileSize(model.fileSize)}</Text>
                <Text style={styles.modelDate}>
                    {new Date(model.createdAt).toLocaleDateString('ka-GE', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        margin: 10,
        overflow: 'hidden',
        maxWidth: '48%',
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    deleteIcon: {
        fontSize: 16,
    },
    thumbnail: {
        width: '100%',
        height: 150,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontWeight: '600',
        marginBottom: 4,
    },
    modelFormat: {
        color: COLORS.secondary,
        fontSize: 12,
        fontWeight: '600',
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
    }
})