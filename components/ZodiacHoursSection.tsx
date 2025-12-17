import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GioHoangDao } from "../utils/lunarCalendar";
import { Strings } from "../constants/Strings";
import { Colors } from "../constants/Colors";

interface ZodiacHoursSectionProps {
  gioHoangDao: GioHoangDao[];
}

export default function ZodiacHoursSection({ gioHoangDao }: ZodiacHoursSectionProps) {
  return (
    <View style={styles.gioHoangDaoSection}>
      <Text style={styles.sectionTitle}>{Strings.goldHours}</Text>
      <View style={styles.gioHoangDaoContainer}>
        {gioHoangDao.map((gio, index) => (
          <View key={index} style={styles.gioItem}>
            {/* Background Icon */}
            <View style={styles.gioIconBackgroundContainer}>
              <Text style={styles.gioIconBackground}>{gio.icon}</Text>
            </View>

            <View style={styles.gioContent}>
              <Text style={styles.gioName}>{gio.gio}</Text>
              <Text style={styles.gioTime}>{gio.thoiGian}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  gioHoangDaoSection: {
    marginBottom: 8,
  },
  gioHoangDaoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gioItem: {
    width: "31%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden", // Clip the background icon
    position: "relative",
    height: 60,
  },
  gioIconBackgroundContainer: {
    position: "absolute",
    bottom: -5,
    right: -5,
    opacity: 0.15,
    zIndex: 1,
  },
  gioIconBackground: {
    fontSize: 40,
  },
  gioContent: {
    alignItems: "center",
    zIndex: 2,
  },
  gioName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  gioTime: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
});
