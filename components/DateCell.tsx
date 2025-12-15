import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { convertSolar2Lunar, getDayName } from "../utils/lunarCalendar";
import { getHolidaysForDate } from "../utils/holidays";

interface DateCellProps {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onPress: (day: number, month: number, year: number) => void;
}

export default function DateCell({ day, month, year, isCurrentMonth, isToday, isSelected, onPress }: DateCellProps) {
  const lunar = convertSolar2Lunar(day, month, year);
  const holidays = getHolidaysForDate(day, month, year);
  const hasHoliday = holidays.length > 0;
  const isPublicHoliday = holidays.some((h) => h.isPublicHoliday);

  return (
    <TouchableOpacity style={[styles.cell, isToday && styles.today, isSelected && styles.selected, isPublicHoliday && styles.publicHoliday]} onPress={() => onPress(day, month, year)}>
      <View style={styles.content}>
        <Text style={[styles.solarDay, !isCurrentMonth && styles.otherMonth, isToday && styles.todayText, isSelected && styles.selectedText, isPublicHoliday && styles.holidayText]}>{day}</Text>
        <Text style={[styles.lunarDay, !isCurrentMonth && styles.otherMonth, isSelected && styles.selectedText, isPublicHoliday && styles.holidayText]}>
          {lunar.day === 1 ? `${lunar.month}/${lunar.day}` : lunar.day}
        </Text>
        {hasHoliday && <View style={styles.holidayDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  solarDay: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lunarDay: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  otherMonth: {
    color: "#ddd",
  },
  today: {
    backgroundColor: "#e3f2fd",
  },
  todayText: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  selected: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  publicHoliday: {
    backgroundColor: "#ffebee",
  },
  holidayText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  holidayDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#f44336",
  },
});
