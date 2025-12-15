import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import DateCell from "./DateCell";

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

  // Nếu chế độ tuần, tính tuần hiện tại dựa trên ngày được chọn
  const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const selectedDayOfWeek = selectedDate.getDay();

  // Lấy ngày đầu tiên của tháng
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...

  // Lấy số ngày trong tháng
  const daysInMonth = new Date(year, month, 0).getDate();

  // Lấy số ngày của tháng trước
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  // Tạo mảng các ngày để hiển thị
  const days: Array<{
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }> = [];

  if (viewMode === "week") {
    // Chế độ tuần: Hiển thị 7 ngày từ Chủ nhật đến Thứ 7
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDayOfWeek);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      days.push({
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() + 1 === month,
      });
    }
  } else {
    // Chế độ tháng: Hiển thị toàn bộ tháng
    // Thêm các ngày của tháng trước
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    // Thêm các ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        month,
        year,
        isCurrentMonth: true,
      });
    }

    // Thêm các ngày của tháng sau
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 tuần x 7 ngày = 42 ngày
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }
  }

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
