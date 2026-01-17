import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { COLORS } from "../constants";
import { Button } from "../components/Button";
import { ScreenProps } from "../navigation/types";

type Props = ScreenProps<"Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>📷</Text>
          <Text style={styles.title}>3D Scanner</Text>
          <Text style={styles.subtitle}>
            გადაიღეთ ობიექტი და შექმენით 3D მოდელი
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => navigation.navigate("Scan")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryActionIcon}>🎯</Text>
            <Text style={styles.primaryActionTitle}>სკანირების დაწყება</Text>
            <Text style={styles.primaryActionSubtitle}>
              გადაიღეთ ობიექტი 360°-ზე
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => navigation.navigate("Gallery")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryActionIcon}>📦</Text>
            <View style={styles.secondaryActionText}>
              <Text style={styles.secondaryActionTitle}>ჩემი მოდელები</Text>
              <Text style={styles.secondaryActionSubtitle}>
                ნახეთ შენახული 3D მოდელები
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>ინსტრუქციები</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>მოათავსეთ ობიექტი</Text>
              <Text style={styles.stepDescription}>
                დადეთ ობიექტი სუფთა ზედაპირზე კარგი განათებით
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>გადაიღეთ ვიდეო</Text>
              <Text style={styles.stepDescription}>
                ნელა შემოატრიალეთ კამერა ობიექტის გარშემო 360°
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>მიიღეთ 3D მოდელი</Text>
              <Text style={styles.stepDescription}>
                აპლიკაცია ავტომატურად შექმნის 3D მოდელს
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>რჩევები</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>💡 გამოიყენეთ კარგი განათება</Text>
            <Text style={styles.tip}>💡 მოერიდეთ გამჭვირვალე ობიექტებს</Text>
            <Text style={styles.tip}>💡 შეინარჩუნეთ სტაბილური სიჩქარე</Text>
            <Text style={styles.tip}>💡 გადაიღეთ მთლიანი 360°</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryActionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  primaryActionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  secondaryAction: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryActionIcon: {
    fontSize: 18,
    marginRight: 16,
  },
  secondaryActionText: {
    flex: 1,
  },
  secondaryActionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  secondaryActionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  instructionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  step: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tipsSection: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
});
