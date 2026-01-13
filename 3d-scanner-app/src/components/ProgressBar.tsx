import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";
import React from "react";

interface ProgressBarProps {
    progress: number;
    currentFrames: number;
    totalFrames: number;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    currentFrames,
    totalFrames,
    showLabel = true,
}) => {
    const getProgressColor = () => {
        if (progress < 50) {
            return COLORS.warning;
        } else if (progress < 80) {
            return COLORS.secondary;
        } else {
            return COLORS.success;
        }
    };

    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={styles.container}>
          {/* Progress Bar Background */}
          <View style={styles.progressBarBackground}>
            {/* Progress Bar Fill */}
            <View
              style={[
                styles.progressBarFill,
                {
                    width: `${clampedProgress}%`,
                    backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>

          {/* Label */}
          {showLabel && (
            <Text style={styles.label}>
                {currentFrames} / {totalFrames} frames
            </Text>
          )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    label: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});