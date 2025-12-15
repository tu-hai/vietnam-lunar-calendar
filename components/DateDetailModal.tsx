import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { convertSolar2Lunar, getDayName, getYearCanChi, getGioHoangDao } from "../utils/lunarCalendar";
import { getHolidaysForDate, getUpcomingEventsInMonth } from "../utils/holidays";

const screenHeight = Dimensions.get("window").height;

interface DateDetailModalProps {
  visible: boolean;
  day: number;
  month: number;
  year: number;
  onClose: () => void;
  viewMode?: "week" | "month";
}

export default function DateDetailModal({ visible, day, month, year, onClose, viewMode = "month" }: DateDetailModalProps) {
  const lunar = convertSolar2Lunar(day, month, year);
  const holidays = getHolidaysForDate(day, month, year);
  const yearCanChi = getYearCanChi(lunar.year);
  const gioHoangDao = getGioHoangDao(day, month, year);

  const weekDays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const date = new Date(year, month - 1, day);
  const dayOfWeek = weekDays[date.getDay()];

  // Kiểm tra có phải ngày hiện tại không
  const today = new Date();
  const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

  // Lấy sự kiện sắp tới nếu đang xem ngày hiện tại
  const upcomingEvents = isToday ? getUpcomingEventsInMonth(day, month, year) : [];

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.body, viewMode === "week" && styles.bodyWeek]} showsVerticalScrollIndicator={false}>
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
        {holidays.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngày lễ</Text>
            {holidays.map((holiday, index) => (
              <View key={index} style={styles.holidayItem}>
                <View style={[styles.holidayDot, holiday.isPublicHoliday && styles.publicHolidayDot]} />
                <View style={styles.holidayInfo}>
                  <Text style={[styles.holidayName, holiday.isPublicHoliday && styles.publicHolidayText]}>{holiday.name}</Text>
                  <Text style={styles.holidayType}>
                    {holiday.isLunar ? "Âm lịch" : "Dương lịch"}
                    {holiday.isPublicHoliday && " • Ngày nghỉ"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Giờ hoàng đạo */}
        <View style={styles.gioHoangDaoSection}>
          <View style={styles.gioHeader}>
            <Text style={styles.gioHeaderIcon}>⏰</Text>
            <Text style={styles.gioHeaderText}>Giờ Hoàng đạo</Text>
          </View>
          <View style={styles.gioHoangDaoContainer}>
            {gioHoangDao.map((gio, index) => (
              <View key={index} style={styles.gioItem}>
                <Text style={styles.gioIcon}>{gio.icon}</Text>
                <Text style={styles.gioName}>{gio.gio}</Text>
                <Text style={styles.gioTime}>{gio.thoiGian}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sự kiện sắp tới - chỉ hiển thị khi xem ngày hiện tại */}
        {isToday && upcomingEvents.length > 0 && (
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  body: {
    maxHeight: 250,
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
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  holidayItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  holidayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff9800",
    marginRight: 10,
    marginTop: 6,
  },
  publicHolidayDot: {
    backgroundColor: "#f44336",
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  publicHolidayText: {
    color: "#d32f2f",
  },
  holidayType: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  gioHoangDaoSection: {
    backgroundColor: "#f0f8f5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  gioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  gioHeaderIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#666",
  },
  gioHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  gioHoangDaoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gioItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gioIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  gioName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 3,
  },
  gioTime: {
    fontSize: 10,
    color: "#888",
  },
  upcomingSection: {
    backgroundColor: "#fff9e6",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffe599",
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
    color: "#666",
  },
  upcomingEventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingEventLeft: {
    marginRight: 12,
  },
  upcomingDayBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 50,
  },
  upcomingDayNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  upcomingDayLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
  },
  upcomingEventRight: {
    flex: 1,
  },
  upcomingEventName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  upcomingPublicHoliday: {
    color: "#d32f2f",
  },
  upcomingEventDate: {
    fontSize: 12,
    color: "#888",
  },
});
