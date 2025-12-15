import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MonthYearSelector from "./MonthYearSelector";
import CalendarGrid from "./CalendarGrid";
import DateDetailModal from "./DateDetailModal";

export default function MonthView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<"week" | "month">("month");

  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
    setSelectedDate({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });
  };

  const handleDatePress = (day: number, month: number, year: number) => {
    setSelectedDate({ day, month, year });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "week" ? "month" : "week");
  };

  return (
    <View style={styles.container}>
      <MonthYearSelector month={currentMonth} year={currentYear} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} viewMode={viewMode} onToggleView={toggleViewMode} />

      <CalendarGrid
        month={currentMonth}
        year={currentYear}
        onDatePress={handleDatePress}
        selectedDay={selectedDate.day}
        selectedMonth={selectedDate.month}
        selectedYear={selectedDate.year}
        viewMode={viewMode}
      />

      <DateDetailModal visible={true} day={selectedDate.day} month={selectedDate.month} year={selectedDate.year} onClose={() => {}} viewMode={viewMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
