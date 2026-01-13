import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { ScreenProps } from "../navigation/types";
import { COLORS } from '../constants';
import { Button } from '../components/Button';
import { Model3D } from '../types/model.types';
import { createModel } from '../services/reconstructionService';

type Props = ScreenProps<'Preview'>;

export const PreviewScreen = ({ route, navigation }: Props) => {
    const { modelId, modelPath } = route.params;
    const [model, setModel] = useState<Model3D | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        try {
            // TODO: ჩატვირთოთ model storage-დან (TASK-8)
            const mockModel: Model3D = {
                id: modelId,
                name: 'My 3D Model',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                format: 'glb',
                filePath: modelPath,
                fileSize: 1024 * 512,
                thumbnailPath: undefined,
                vertexCount: 15420,
                faceCount: 30840,
                textureCount: 1,
                status: 'completed',
                processingTime: 3,
                frameCount: 60,
                description: '3D model created from 60 frames',
                tags: ['scanned', 'mobile'],
            };

            setModel(mockModel);
            setLoading(false);
        } catch (err) {
            console.error('Model load error:', err);
            Alert.alert('შეცდომა', 'მოდელის ჩატვირთვა ვერ მოხერხდა');
            navigation.goBack();
        }
    };

    const handleSave = () => {
        Alert.alert('შენახვა', 'მოდელი შენახულია! (MOCK)');
    };

    const handleExport = () => {
        Alert.alert('ექსპორტი', 'მოდელის ექსპორტი (MOCK)\n\nფორმატი: GLB');
    };

    const handleDelete = () => {
        Alert.alert(
            'წაშლა',
            'დარწმუნებული ხართ, რომ გსურთ მოდელის წაშლა?',
            [
                { text: 'გაუქმება', style: 'cancel' },
                {
                    text: 'წაშლა',
                    style: 'destructive',
                    onPress: () => {
                        navigation.navigate('Home');
                    },
                },
            ]
        );
    };

    if (loading || !model) {
        return (
            <View style={styles.container}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Mock 3D Viewer Placeholder */}
                <View style={styles.viewerContainer}>
                    <Text style={styles.mockViewerIcon}>📦</Text>
                    <Text style={styles.mockViewerText}>3D Model Preview</Text>
                    <Text style={styles.mockViewerSubtext}>
                        TODO: REAL 3D Viewer (Three.js / WebGL)
                    </Text>
                </View>

                {/* Model Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Model Information</Text>

                    <InfoRow label="Name" value={model.name} />
                    <InfoRow label="Format" value={model.format.toUpperCase()} />
                    <InfoRow label="File Size" value={formatFileSize(model.fileSize)} />
                    <InfoRow label="Created" value={formatDate(model.createdAt)} />
                </View>

                {/* SStatistics */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Statistics</Text>

                    <InfoRow label="Vertices" value={model.vertexCount?.toLocaleString() || 'N/A'} />
                    <InfoRow label="Faces" value={model.faceCount?.toLocaleString() || 'N/A'} />
                    <InfoRow label="Textures" value={model.textureCount?.toLocaleString() || 'N/A'} />
                    <InfoRow label="Frames Used" value={model.frameCount?.toLocaleString() || 'N/A'} />
                </View>

                {/* Processing Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Processing</Text>

                    <InfoRow label="Status" value={model.status} />
                    <InfoRow label="Processing Time" value={`${model.processingTime}s`} />
                </View>
            </ScrollView>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                <Button
                  title="შენახვა"
                  onPress={handleSave}
                  variant="primary"
                  style={styles.button}
                />
                <Button
                  title="ექსპორტი"
                  onPress={handleExport}
                  variant="secondary"
                  style={styles.button}
                />
                <Button
                  title="წაშლა"
                  onPress={handleDelete}
                  variant="outline"
                  style={styles.button}
                />
            </View>
        </View>
    )
}

interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    loadingText: {
        color: COLORS.text,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    viewerContainer: {
        height: 300,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    mockViewerIcon: {
        fontSize: 80,
        marginBottom: 10,
    },
    mockViewerText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mockViewerSubtext: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    infoValue: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    bottomControls: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
});