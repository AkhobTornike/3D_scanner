import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { ProgressBar } from '../components/ProgressBar';
import { extractFramesFromVideo, cleanupVideo } from '../services/frameExtractor';
import { optimizeImageBatch } from '../utils/imageProcessor';

type Props = ScreenProps<'Processing'>;

export const ProcessingScreen = ({ route, navigation }: Props) => {
    const { videoPath } = route.params;

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('მომზადება...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        processVideo();
    }, []);

    const processVideo = async () => {
        try {
            setStatus('ვიდეოდან ფრეიმების ამოღება...');
            setProgress(10);

            const frameUris = await extractFramesFromVideo(videoPath, 60);

            if (frameUris.length === 0) {
                throw new Error('ფრეიმების ამოღება ვერ მოხერხდა');
            }

            setProgress(50);
            console.log(`Extracted ${frameUris.length} frames`);

            setStatus('სურათების ოპტიმიზაცია...');
            setProgress(60);

            const optimizedUris = await optimizeImageBatch(frameUris);

            setProgress(90);
            console.log(`Optimized ${optimizedUris.length} images`);

            setStatus('დასრულება...');
            await cleanupVideo(videoPath);

            setProgress(100);
            setStatus('დასრულებულია!');

            // TODO: Navigate to PreviewScreen
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } catch (err) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'დამუშავების შეცდომა');
            setStatus('შეცდომა');
        }
    };

    return (
        <View style={styles.container}>
            {/* Spinner */}
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.spinner}
            />

            {/* Status Text */}
            <Text style={styles.statusText}>{status}</Text>

            {/* Progress Bar */}
            {!error && (
                <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={progress}
                      currentFrames={Math.round(progress * 0.6)}
                      totalFrames={60}
                      showLabel={false}
                    />
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
            )}

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                    <Text
                      style={styles.retryText}
                      onPress={() => navigation.goBack()}
                    >
                        უკან დაბრუნება
                    </Text>
                </View>
            )}

            {/* Processing Steps Info */}
            {!error && (
                <View style={styles.stepsContainer}>
                    <ProcessingStep
                      step="1"
                      title="ფრეიმების ამოღება"
                      isActive={progress < 50}
                      isCompleted={progress >= 50}
                    />
                    <ProcessingStep
                      step="2"
                      title="სურათების ოპტიმიზაცია"
                      isActive={progress >= 50 && progress < 100}
                      isCompleted={progress === 100}
                    />
                </View>
            )}
        </View>
    );
};

interface ProcessingStepProps {
    step: string;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({

    step,
    title,
    isActive,
    isCompleted,
}) => {
    return (
        <View style={styles.stepRow}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.stepNumberActive,
                  ]}
                >
                    {isCompleted ? '✓' : step}
                </Text>
            </View>
            <Text
              style={[
                styles.stepTitle,
                (isActive || isCompleted) && styles.stepTitleActive,
              ]}
            >
                {title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    spinner: {
        marginBottom: 30,
    },
    statusText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    progressText: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    errorContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepsContainer: {
        marginTop: 40,
        width: '100%',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stepCircleActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    stepCircleCompleted: {
        borderColor: COLORS.success,
        backgroundColor: COLORS.success,
    },
    stepNumber: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepNumberActive: {
        color: COLORS.text,
    },
    stepTitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    stepTitleActive: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
});