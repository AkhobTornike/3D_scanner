import { deleteLegacyDocumentDirectoryAndroid } from "expo-file-system";
import React, { useEffect } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Easing,
} from "react-native-reanimated";

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

interface ScaleInViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = "right",
  delay = 0,
  distance = 50,
  style,
}) => {
  const translateX = useSharedValue(
    direction === "left" ? -distance : direction === "right" ? distance : 0
  );
  const translateY = useSharedValue(
    direction === "up" ? -distance : direction === "down" ? distance : 0
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 90 })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 90 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

interface PulseViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

export const PulseView: React.FC<PulseViewProps> = ({
  children,
  style,
  active = true,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      const pulse = () => {
        scale.value = withTiming(1.1, { duration: 800 }, () => {
          scale.value = withTiming(1, { duration: 800 });
        });
      };

      pulse();
      const interval = setInterval(pulse, 1600);
      return () => clearInterval(interval);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
        {children}
    </Animated.View>
  );
};

export const AnimationPresets = {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    fadeInUp: FadeIn.duration(400).springify(),
    fadeInScale: FadeIn.duration(300).springify().damping(12),
};

export { Animated };