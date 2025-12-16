import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Holiday } from "../utils/holidays";
import { Strings } from "../constants/Strings";
import { Colors } from "../constants/Colors";

interface HolidaySectionProps {
  holidays: Holiday[];
}

export default function HolidaySection({ holidays }: HolidaySectionProps) {
  if (holidays.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{Strings.holidays}</Text>
      {holidays.map((holiday, index) => (
        <View key={index} style={styles.holidayItem}>
          <View style={[styles.holidayDot, holiday.isPublicHoliday && styles.publicHolidayDot]} />
          <View style={styles.holidayInfo}>
            <Text style={[styles.holidayName, holiday.isPublicHoliday && styles.publicHolidayText]}>{holiday.name}</Text>
            <Text style={styles.holidayType}>
              {holiday.isLunar ? Strings.lunar : Strings.solar}
              {holiday.isPublicHoliday && ` ${Strings.publicHoliday}`}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  holidayItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  holidayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  publicHolidayDot: {
    backgroundColor: Colors.secondary,
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  publicHolidayText: {
    color: Colors.publicHolidayText,
  },
  holidayType: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
