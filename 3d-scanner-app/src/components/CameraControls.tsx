import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface CameraControlsProps {
    isRecording: boolean;
    onRecordPress: () => void;
    onFlipCamera: () => void;
    onToggleFlash?: () => void;
    flashEnabled?: boolean;
    disableFlip?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
    isRecording,
    onRecordPress,
    onFlipCamera,
    onToggleFlash,
    flashEnabled = false,
    disableFlip = false,
}) => {
    return (
        <View style={styles.container}>
            {/* Left Button - Camera Flip */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onFlipCamera}
              disabled={disableFlip}
            >
                <Text style={[styles.iconText, disableFlip && styles.iconDisabled]}>
                    🔄
                </Text>
            </TouchableOpacity>

            {/* Center Button - Record/Stop */}
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={onRecordPress}
            >
                <View
                  style={[
                    styles.recordButtonInner,
                    isRecording && styles.recordButtonInnerActive,
                  ]}
                />
            </TouchableOpacity>

            {/* Right Button - Flash Toggle */}
            {onToggleFlash ? (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onToggleFlash}
                  disabled={isRecording}
                >
                    <Text
                      style={[
                        styles.iconText,
                        isRecording && styles.iconDisabled,
                        flashEnabled && styles.flashActive,
                      ]}
                    >
                      {flashEnabled ? '⚡' : '⚡'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.iconButton} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
    },
    iconText: {
        fontSize: 24,
    },
    iconDisabled: {
        opacity: 0.3,
    },
    flashActive: {
        opacity: 1,
        textShadowColor: COLORS.warning,
        textShadowRadius: 10,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.text,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.primary,
    },
    recordButtonActive: {
        borderColor: COLORS.error,
    },
    recordButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.error,
    },
    recordButtonInnerActive: {
        width: 40,
        height: 40,
        borderRadius: 8,
    }
})