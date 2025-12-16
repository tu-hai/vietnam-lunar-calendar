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
            <View style={styles.gioHeader}>
              <Text style={styles.gioIcon}>{gio.icon}</Text>
              <Text style={styles.gioName}>{gio.gio}</Text>
            </View>
            <Text style={styles.gioTime}>{gio.thoiGian}</Text>
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
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  gioIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  gioName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  gioTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
