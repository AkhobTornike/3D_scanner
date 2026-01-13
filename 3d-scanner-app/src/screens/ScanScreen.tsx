import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import { StackNavigation } from '../navigation/types';
import { useCamera } from '../hooks';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SCAN_CONFIG } from '../constants';
import { CameraControls } from '../components/CameraControls';

interface Props {
    navigation: StackNavigation<'Scan'>;
}

export const ScanScreen: React.FC<Props> = ({ navigation }) => {
    const {
        permission,
        requestPermission,
        isRecording,
        startRecording,
        stopRecording,
        recordingDuration,
        cameraRef,
        cameraType,
        toggleCameraType,
    } = useCamera();

    const [frameCount, setFrameCount] = useState(0);

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>
                    კამერის წვდომა საჭიროა 3D სკანირებისთვის.
                </Text>
                <Button
                  title="მიეცი წვდომა"
                  onPress={requestPermission}
                  variant="primary"
                />
            </View>
        );
    }

    const handleRecordPress = async () => {
        if (isRecording) {
            await stopRecording();
            Alert.alert(
                'ჩაწერა დასრულებული',
                'ვიდეო ჩაიწერა წარმატებით!',
                [{ text: 'კარგი' }]
            );
        } else {
            const videoUri = await startRecording();
            if (!videoUri) {
                Alert.alert('შეცდომა', 'ვიდეოს ჩაწერა ვერ მოხერხდა');
            }
        }
    };

    const estimatedFrames = Math.floor(recordingDuration * SCAN_CONFIG.FRAME_RATE / 2);
    const progress = (estimatedFrames / SCAN_CONFIG.RECOMMENDED_FRAMES) * 100;

    return (
        <View style={styles.container}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              mode="video"
            >
                <View style={styles.overlay}>
                    {/* Top Info */}
                    <View style={styles.topInfo}>
                        {isRecording && (
                            <View style={styles.recordingIndicator}>
                                <View style={styles.recordingDot} />
                                <Text style={styles.recordingText}>
                                    REC {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Center Guide */}
                    <View style={styles.centerGuide}>
                        <View style={styles.guideCircle} />
                        <Text style={styles.guideText}>
                            {isRecording
                              ? 'ატრიალეთ ობიექტი 360°'
                              : 'მოათავსეთ ობიექტი ცენტრში'}
                        </Text>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomControls}>
                        {isRecording && (
                            <View style={styles.progressContainer}>
                                <ProgressBar
                                  progress={progress}
                                  currentFrames={estimatedFrames}
                                  totalFrames={SCAN_CONFIG.RECOMMENDED_FRAMES}
                                />
                            </View>
                        )}

                        <CameraControls
                          isRecording={isRecording}
                          onRecordPress={handleRecordPress}
                          onFlipCamera={toggleCameraType}
                          disableFlip={isRecording}
                        />
                    </View>
                </View>
            </CameraView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: COLORS.text,
        fontSize: 16,
    },
    permissionText: {
        color: COLORS.text,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 40,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    topInfo: {
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        marginRight: 8,
    },
    recordingText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    centerGuide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 3,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        opacity: 0.6,
    },
    guideText: {
        color: COLORS.text,
        fontSize: 16,
        marginTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    bottomControls: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    progressContainer: {
        marginBottom: 20,
    },
});