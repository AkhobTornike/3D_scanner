import React from 'react';
  import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
  } from 'react-native';
  import { COLORS } from '../constants';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}) => {
    const getButtonStyle = () => {
        const baseStyle: ViewStyle[] = [styles.button];

        if (fullWidth) {
            baseStyle.push(styles.fullWidth);
        }

        if (variant === 'primary') {
            baseStyle.push(styles.primaryButton);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButton);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineButton);
        }

        if (disabled || loading) {
            baseStyle.push(styles.disabled);
        }

        if (style) {
            baseStyle.push(style);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle: TextStyle[] = [styles.text];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryText);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryText);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineText);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                  color={variant === 'primary' ? COLORS.text : COLORS.primary}
                />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    fullWidth: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    primaryText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    secondaryText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    outlineText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});