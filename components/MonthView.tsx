import React, { useState, useEffect } from "react";
import { View, StyleSheet, LayoutAnimation, Platform, UIManager, InteractionManager, ActivityIndicator } from "react-native";
import MonthYearSelector from "./MonthYearSelector";
import CalendarGrid from "./CalendarGrid";
import DateDetailModal from "./DateDetailModal";
import { useVerticalSwipeGesture } from "../hooks/useSwipeGesture";

export default function MonthView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => interaction.cancel();
  }, []);

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

  const toggleViewMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMode(viewMode === "week" ? "month" : "week");
  };

  const handleSwipeUp = () => {
    if (viewMode === "month") {
      toggleViewMode();
    }
  };

  const handleSwipeDown = () => {
    if (viewMode === "week") {
      toggleViewMode();
    }
  };

  const panResponder = useVerticalSwipeGesture(handleSwipeUp, handleSwipeDown);

  const handleDatePress = (day: number, month: number, year: number) => {
    setSelectedDate({ day, month, year });
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <MonthYearSelector month={currentMonth} year={currentYear} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} viewMode={viewMode} onToggleView={toggleViewMode} />

      <View {...panResponder.panHandlers}>
        {isReady ? (
          <CalendarGrid
            month={currentMonth}
            year={currentYear}
            onDatePress={handleDatePress}
            selectedDay={selectedDate.day}
            selectedMonth={selectedDate.month}
            selectedYear={selectedDate.year}
            viewMode={viewMode}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1976d2" />
          </View>
        )}
      </View>

      <DateDetailModal day={selectedDate.day} month={selectedDate.month} year={selectedDate.year} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
});
