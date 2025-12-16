import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { convertSolar2Lunar } from "../utils/lunarCalendar";
import { getEventTheme } from "../utils/holidays";
import { useMonthlyEvents } from "../hooks/useEvents";
import { SOLAR_MONTH_NAMES } from "../utils/constants";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

interface EventsViewProps {
  navigation?: any; // Add navigation prop
  onDateSelect?: (date: Date) => void;
}

export default function EventsView({ navigation, onDateSelect }: EventsViewProps) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  // Use custom hook for events calculation
  const events = useMonthlyEvents(selectedMonth, selectedYear);

  const handlePrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToday = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const today = new Date();
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>

        <View style={styles.centerSection}>
          <Text style={styles.headerTitle}>
            {SOLAR_MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={handleToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>{Strings.thisMonth}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          📅 {events.length} {Strings.eventsInMonth} {selectedMonth}/{selectedYear}
        </Text>
        <Text style={styles.summarySubtext}>
          {events.filter((e) => e.holiday.isPublicHoliday).length} {Strings.publicHolidaysCount}
        </Text>
      </View>

      {/* Events List */}
      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsIcon}>📅</Text>
            <Text style={styles.noEventsText}>{Strings.noEvents}</Text>
          </View>
        }
        renderItem={({ item: event, index }) => {
          const lunar = convertSolar2Lunar(event.day, event.month, event.year);
          const theme = getEventTheme(event.holiday.name);

          return (
            <TouchableOpacity
              style={[styles.eventCard, { backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1 }]}
              onPress={() => {
                const selectedDate = new Date(event.year, event.month - 1, event.day);
                if (navigation) {
                  navigation.navigate(Strings.calendarDay, { date: selectedDate.toISOString() });
                } else {
                  onDateSelect?.(selectedDate);
                }
              }}
              activeOpacity={0.7}
            >
              {/* Watermark Background */}
              <View style={styles.eventWatermark}>
                <Text style={[styles.eventWatermarkIcon, { color: theme.iconColor }]}>{theme.emoji}</Text>
              </View>

              <View style={styles.eventDateSection}>
                <Text style={styles.eventDay}>{event.day}</Text>
                <Text style={styles.eventMonth}>
                  {Strings.month} {event.month}
                </Text>
              </View>

              <View style={styles.eventInfoSection}>
                <Text style={[styles.eventName, event.holiday.isPublicHoliday && styles.publicHolidayName]}>{event.holiday.name}</Text>
                <Text style={styles.eventType}>
                  {event.holiday.isLunar ? `${Strings.lunar}: ${lunar.day}/${lunar.month}` : Strings.solar}
                  {event.holiday.isPublicHoliday && ` ${Strings.publicHoliday}`}
                </Text>
              </View>

              {event.holiday.isPublicHoliday && (
                <View style={styles.publicHolidayBadge}>
                  <Text style={styles.publicHolidayBadgeText}>{Strings.dayOff}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: "bold",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textTransform: "uppercase",
  },
  todayButton: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: "600",
  },
  summarySection: {
    backgroundColor: Colors.background,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
  summarySubtext: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden", // Clip watermark
    position: "relative",
  },
  eventWatermark: {
    position: "absolute",
    right: -10,
    bottom: -15,
    opacity: 0.15,
    transform: [{ rotate: "-15deg" }],
    zIndex: 0,
  },
  eventWatermarkIcon: {
    fontSize: 100,
  },
  eventDateSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    minWidth: 60,
  },
  eventDay: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  eventMonth: {
    fontSize: 11,
    color: Colors.white,
    marginTop: 2,
  },
  eventInfoSection: {
    flex: 1,
    justifyContent: "center",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
  publicHolidayName: {
    color: Colors.publicHolidayText,
  },
  eventType: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  publicHolidayBadge: {
    backgroundColor: Colors.publicHolidayBadge,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  publicHolidayBadgeText: {
    fontSize: 11,
    color: Colors.publicHolidayText,
    fontWeight: "600",
  },
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  noEventsIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  noEventsText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
