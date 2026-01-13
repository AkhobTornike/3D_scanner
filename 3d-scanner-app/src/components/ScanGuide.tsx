import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants";

interface ScanGuideProps {
    isRecording: boolean;
    progress?: number;
}

export const ScanGuide: React.FC<ScanGuideProps> = ({
    isRecording,
    progress = 0,
}) => {
    const guideText = isRecording
      ? 'ატრიალეთ ობიექტი ნელა 360°'
      : 'მოათავსეთ ობიექტი ცენტრში';

    const circleSize = 250;
    const strokeWidth = 3;
    const radius = (circleSize - strokeWidth) / 2;
    const center = circleSize / 2;
    const circumference = 2 * Math.PI * radius;

    const progressOffset = circumference - (progress / 100) * circumference;

    return (
        <View style={styles.container}>
            {/* Guide Circle with Progress */}
            <View style={styles.circleContainer}>
                {/* Base Circle (Dashed) */}
                <View style={styles.baseCircle} />

                {/* Progress Arc (SVG) */}
                {isRecording && progress > 0 && (
                    <Svg
                      width={circleSize}
                      height={circleSize}
                      style={styles.svg}
                    >
                        <Circle
                          cx={center}
                          cy={center}
                          r={radius}
                          stroke={COLORS.success}
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={progressOffset}
                          strokeLinecap="round"
                          rotation="-90"
                          origin={`${center}, ${center}`}
                        />
                    </Svg>
                )}
            </View>

            {/* Guide Text */}
            <Text style={styles.guideText}>{guideText}</Text>

            {/* Progress Percentage */}
            {isRecording && (
                <Text style={styles.progressText}>
                    {Math.round(progress)}% ({Math.round(progress * 3.6)}°)
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    baseCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 3,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        opacity: 0.6,
        position: 'absolute',
    },
    svg: {
        position: 'absolute',
    },
    guideText: {
        color: COLORS.text,
        fontSize: 16,
        marginTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        textAlign: 'center',
    },
    progressText: {
        color: COLORS.success,
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
    },
});