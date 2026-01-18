import React from "react";
import { 
    View, 
    Text,
    StyleSheet,
    ActivityIndicator,
    Modal,
    StyleProp,
    ViewStyle,
} from "react-native";
import { COLORS } from "../constants";

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message = "იტვირთება...",
    transparent = true,
}) => {
    if (!visible) return null;

    return (
        <Modal
          visible={visible}
          transparent={transparent}
          animationType="fade"
          statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    {message && <Text style={styles.message}>{message}</Text>}
                </View>
            </View>
        </Modal>
    );
};

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = COLORS.primary,
    style,
}) => {
    return (
        <View style={[styles.spinnerContainer, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

interface LoadingScreenProps {
    message?: string;
    subMessage?: string;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = "იტვირთება...",
    subMessage,
}) => {
    return (
        <View style={styles.fullScreen}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTexT}>{message}</Text>
            {subMessage && <Text style={styles.subText}>{subMessage}</Text>}
        </View>
    );
};

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
    style,
}) => {
    return (
        <View
          style={[
            styles.skeleton,
            {
              width: width as number | string,
              height,
              borderRadius,
            } as ViewStyle,
            style,
          ]}
        />
    );
};

export const ModelCardSkeleton: React.FC = () => {
    return (
        <View style={styles.cardSkeleton}>
            <SkeletonLoader height={150} borderRadius={8} />
            <View style={styles.cardSkeletonContent}>
                <SkeletonLoader width='70%' height={16} />
                <SkeletonLoader width='40%' height={12} style={{ marginTop: 8 }} />
                <SkeletonLoader width='50%' height={12} style={{ marginTop: 3 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 40,
        paddingVertical: 30,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 200,
    },
    message: {
        color: COLORS.text,
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingTexT: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
    },
    subText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    skeleton: {
        backgroundColor: COLORS.border,
        opacity: 0.5,
    },
    cardSkeleton: {
        flex: 1,
        maxWidth: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16, 
    },
    cardSkeletonContent: {
        padding: 12,
    },
})