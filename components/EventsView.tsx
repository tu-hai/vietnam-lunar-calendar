import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { convertSolar2Lunar } from "../utils/lunarCalendar";
import { vietnamHolidays, getHolidaysForDate } from "../utils/holidays";

interface EventsViewProps {
  onDateSelect?: (date: Date) => void;
}

export default function EventsView({ onDateSelect }: EventsViewProps) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  // Lấy tất cả sự kiện trong tháng dương lịch đã chọn
  // Duyệt từ ngày 1 đến ngày cuối tháng, lấy cả sự kiện dương lịch và âm lịch
  const getAllEventsInMonth = () => {
    const events: Array<{
      day: number;
      month: number;
      year: number;
      holiday: any;
    }> = [];

    // Lấy số ngày trong tháng được chọn
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // Duyệt qua từng ngày trong tháng dương lịch
    for (let day = 1; day <= daysInMonth; day++) {
      // getHolidaysForDate sẽ trả về cả sự kiện dương lịch và âm lịch
      // cho ngày dương lịch cụ thể này
      const holidays = getHolidaysForDate(day, selectedMonth, selectedYear);

      holidays.forEach((holiday) => {
        events.push({
          day,
          month: selectedMonth,
          year: selectedYear,
          holiday,
        });
      });
    }

    return events.sort((a, b) => a.day - b.day);
  };

  const events = getAllEventsInMonth();

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToday = () => {
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
            {monthNames[selectedMonth - 1]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={handleToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Tháng này</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          📅 {events.length} sự kiện trong tháng {selectedMonth}/{selectedYear}
        </Text>
        <Text style={styles.summarySubtext}>{events.filter((e) => e.holiday.isPublicHoliday).length} ngày nghỉ lễ</Text>
      </View>

      {/* Events List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {events.length > 0 ? (
          events.map((event, index) => {
            const lunar = convertSolar2Lunar(event.day, event.month, event.year);

            return (
              <TouchableOpacity
                key={index}
                style={styles.eventCard}
                onPress={() => {
                  const selectedDate = new Date(event.year, event.month - 1, event.day);
                  onDateSelect?.(selectedDate);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.eventDateSection}>
                  <Text style={styles.eventDay}>{event.day}</Text>
                  <Text style={styles.eventMonth}>Tháng {event.month}</Text>
                </View>

                <View style={styles.eventInfoSection}>
                  <Text style={[styles.eventName, event.holiday.isPublicHoliday && styles.publicHolidayName]}>{event.holiday.name}</Text>
                  <Text style={styles.eventType}>
                    {event.holiday.isLunar ? `Âm lịch: ${lunar.day}/${lunar.month}` : "Dương lịch"}
                    {event.holiday.isPublicHoliday && " • Ngày nghỉ"}
                  </Text>
                </View>

                {event.holiday.isPublicHoliday && (
                  <View style={styles.publicHolidayBadge}>
                    <Text style={styles.publicHolidayBadgeText}>Nghỉ</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsIcon}>📅</Text>
            <Text style={styles.noEventsText}>Không có sự kiện nào trong tháng này</Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
  },
  todayButton: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  summarySection: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  summarySubtext: {
    fontSize: 13,
    color: "#888",
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventDateSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 15,
    minWidth: 60,
  },
  eventDay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  eventMonth: {
    fontSize: 11,
    color: "#fff",
    marginTop: 2,
  },
  eventInfoSection: {
    flex: 1,
    justifyContent: "center",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  publicHolidayName: {
    color: "#d32f2f",
  },
  eventType: {
    fontSize: 13,
    color: "#888",
  },
  publicHolidayBadge: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  publicHolidayBadgeText: {
    fontSize: 11,
    color: "#d32f2f",
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
    color: "#888",
  },
});
