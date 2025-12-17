import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DateCell from "./DateCell";
import { useCalendarMatrix } from "../hooks/useCalendarMatrix";

interface CalendarGridProps {
  month: number;
  year: number;
  onDatePress: (day: number, month: number, year: number) => void;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  viewMode: "week" | "month";
}

export default function CalendarGrid({ month, year, onDatePress, selectedDay, selectedMonth, selectedYear, viewMode }: CalendarGridProps) {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  // Use the custom hook to generate the calendar matrix
  const days = useCalendarMatrix({
    month,
    year,
    selectedDay,
    selectedMonth,
    selectedYear,
    viewMode,
  });

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <View style={styles.container}>
      {/* Header với các thứ */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, index === 0 && styles.sunday]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid các ngày */}
      <View style={styles.grid}>
        {days.map((dateInfo, index) => {
          const isToday = dateInfo.day === todayDay && dateInfo.month === todayMonth && dateInfo.year === todayYear;
          const isSelected = dateInfo.day === selectedDay && dateInfo.month === selectedMonth && dateInfo.year === selectedYear;

          return (
            <DateCell
              key={index}
              day={dateInfo.day}
              month={dateInfo.month}
              year={dateInfo.year}
              isCurrentMonth={dateInfo.isCurrentMonth}
              isToday={isToday}
              isSelected={isSelected}
              onPress={onDatePress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  weekHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  weekDayCell: {
    width: "14.28%",
    paddingVertical: 10,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  sunday: {
    color: "#d32f2f",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
