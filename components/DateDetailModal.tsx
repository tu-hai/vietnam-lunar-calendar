import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { convertSolar2Lunar, getDayName, getYearCanChi, getGioHoangDao } from "../utils/lunarCalendar";
import { getHolidaysForDate, getUpcomingEventsInMonth } from "../utils/holidays";
import { Colors } from "../constants/Colors";
import HolidaySection from "./HolidaySection";
import ZodiacHoursSection from "./ZodiacHoursSection";

interface DateDetailModalProps {
  day: number;
  month: number;
  year: number;
  onClose: () => void;
}

export default function DateDetailModal({ day, month, year, onClose }: DateDetailModalProps) {
  const lunar = convertSolar2Lunar(day, month, year);
  const holidays = getHolidaysForDate(day, month, year);
  const yearCanChi = getYearCanChi(lunar.year);
  const gioHoangDao = getGioHoangDao(day, month, year);

  const weekDays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const date = new Date(year, month - 1, day);
  const dayOfWeek = weekDays[date.getDay()];

  // Lấy sự kiện sắp tới nếu đang xem ngày hiện tại
  const upcomingEvents = getUpcomingEventsInMonth(day, month, year);

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.body]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Dương lịch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dương lịch</Text>
          <Text style={styles.dateText}>
            {dayOfWeek}, {day}/{month}/{year}
          </Text>
        </View>

        {/* Âm lịch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Âm lịch</Text>
          <Text style={styles.dateText}>
            {getDayName(lunar.day)} tháng {lunar.month}
            {lunar.leap && " (nhuận)"}
          </Text>
          <Text style={styles.subText}>Năm {yearCanChi}</Text>
        </View>

        {/* Ngày lễ */}
        <HolidaySection holidays={holidays} />

        {/* Giờ hoàng đạo */}
        <ZodiacHoursSection gioHoangDao={gioHoangDao} />

        {/* Sự kiện sắp tới - chỉ hiển thị khi xem ngày hiện tại */}
        {upcomingEvents.length > 0 && (
          <View style={styles.upcomingSection}>
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingHeaderIcon}>📅</Text>
              <Text style={styles.upcomingHeaderText}>Sự kiện sắp tới</Text>
            </View>
            {upcomingEvents.map((event, index) => (
              <View key={index} style={styles.upcomingEventItem}>
                <View style={styles.upcomingEventLeft}>
                  <View style={styles.upcomingDayBadge}>
                    <Text style={styles.upcomingDayNumber}>{event.daysUntil}</Text>
                    <Text style={styles.upcomingDayLabel}>ngày</Text>
                  </View>
                </View>
                <View style={styles.upcomingEventRight}>
                  <Text style={[styles.upcomingEventName, event.holiday.isPublicHoliday && styles.upcomingPublicHoliday]}>{event.holiday.name}</Text>
                  <Text style={styles.upcomingEventDate}>
                    {event.day}/{event.month}/{event.year} • {event.holiday.isLunar ? "Âm lịch" : "Dương lịch"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  body: {
    flex: 1,
  },
  bodyWeek: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  subText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  // Removed unused holiday style
  gioHoangDaoSection: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  // Removed unused gio styles
  upcomingSection: {
    backgroundColor: "#fff9e6", // Keeping as specific highlight for now or convert to Colors if exists
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffe599", // Keeping specific
  },
  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  upcomingHeaderIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  upcomingHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  upcomingEventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingEventLeft: {
    marginRight: 12,
  },
  upcomingDayBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 50,
  },
  upcomingDayNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  upcomingDayLabel: {
    fontSize: 10,
    color: Colors.white,
    marginTop: 2,
  },
  upcomingEventRight: {
    flex: 1,
  },
  upcomingEventName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  upcomingPublicHoliday: {
    color: Colors.publicHolidayText,
  },
  upcomingEventDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
