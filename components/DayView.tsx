import React, { useState, useRef, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder, ImageBackground, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { convertSolar2Lunar, getDayName, getYearCanChi, getGioHoangDao, getDayCanChi } from "../utils/lunarCalendar";
import { getHolidaysForDate, getUpcomingEventsInMonth } from "../utils/holidays";
import { getProverbForDate } from "../utils/proverbs";

interface DayViewProps {
  initialDate?: Date | null;
}

export default function DayView({ initialDate }: DayViewProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate || today);

  // Update selectedDate when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);
  const swipeThreshold = 50;
  const [location, setLocation] = useState<string>("Đang tải...");
  const [temperature, setTemperature] = useState<string>("--°C");
  const [weatherIcon, setWeatherIcon] = useState<string>("🌡️");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const day = selectedDate.getDate();
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const lunar = convertSolar2Lunar(day, month, year);
  const holidays = getHolidaysForDate(day, month, year);
  const yearCanChi = getYearCanChi(lunar.year);
  const dayCanChi = getDayCanChi(lunar.jd);
  const gioHoangDao = getGioHoangDao(day, month, year);

  const weekDays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayOfWeek = weekDays[selectedDate.getDay()];

  const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
  const upcomingEvents = isToday ? getUpcomingEventsInMonth(day, month, year) : [];
  const proverb = getProverbForDate(day, month, year);

  // Vietnamese folk art patterns/emojis
  const vietnameseFolkImages = useMemo(
    () => [
      { emoji: "🎋", name: "Cây tre" },
      { emoji: "🏯", name: "Nhà sàn" },
      { emoji: "🦆", name: "Vịt" },
      { emoji: "🐓", name: "Gà" },
      { emoji: "🐃", name: "Trâu" },
      { emoji: "🎍", name: "Tre nứa" },
      { emoji: "🌾", name: "Lúa" },
      { emoji: "🏮", name: "Lồng đèn" },
      { emoji: "🎏", name: "Cờ" },
      { emoji: "🍵", name: "Trà" },
      { emoji: "🥢", name: "Đũa" },
      { emoji: "🎭", name: "Mặt nạ" },
      { emoji: "🪁", name: "Diều" },
      { emoji: "🎪", name: "Lều" },
      { emoji: "🌸", name: "Hoa đào" },
    ],
    []
  );

  // Select background based on date (consistent for same date)
  const backgroundPattern = useMemo(() => {
    const index = (day + month + year) % vietnameseFolkImages.length;
    return vietnameseFolkImages[index];
  }, [day, month, year, vietnameseFolkImages]);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }

    if (event.type === "dismissed" && Platform.OS === "ios") {
      setShowDatePicker(false);
    }
  };

  const handleMonthYearPress = () => {
    setShowDatePicker(true);
  };

  // Get location and weather
  useEffect(() => {
    (async () => {
      try {
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Đà Nẵng");
          // Fetch weather for Da Nang as default
          await fetchWeatherForCity(16.0544, 108.2022); // Da Nang coordinates
          return;
        }

        // Get current position
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        // Reverse geocode to get city name
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const city = reverseGeocode[0].city || reverseGeocode[0].region || reverseGeocode[0].country || "Đà Nẵng";
          setLocation(city);
        }

        // Fetch weather data
        await fetchWeatherForCity(latitude, longitude);
      } catch (error) {
        console.log("Error getting location or weather:", error);
        setLocation("Đà Nẵng");
        // Fetch weather for Da Nang as fallback
        await fetchWeatherForCity(16.0544, 108.2022);
      }
    })();
  }, []);

  const fetchWeatherForCity = async (latitude: number, longitude: number) => {
    try {
      const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

      console.log("Fetching weather from:", weatherUrl);
      const response = await fetch(weatherUrl);
      const weatherData = await response.json();

      console.log("Weather data received:", JSON.stringify(weatherData, null, 2));

      // Check if API returned an error
      if (weatherData.cod && weatherData.cod !== 200) {
        console.log("Weather API error:", weatherData.message);
        setTemperature("--°C");
        setWeatherIcon("🌡️");
        return;
      }

      if (weatherData.main && weatherData.main.temp !== undefined) {
        const temp = Math.round(weatherData.main.temp);
        setTemperature(`${temp}°C`);
        console.log("Temperature set to:", `${temp}°C`);

        // Set weather icon based on condition
        if (weatherData.weather && weatherData.weather.length > 0) {
          const weatherCondition = weatherData.weather[0].main.toLowerCase();
          if (weatherCondition.includes("clear")) setWeatherIcon("☀️");
          else if (weatherCondition.includes("cloud")) setWeatherIcon("☁️");
          else if (weatherCondition.includes("rain")) setWeatherIcon("🌧️");
          else if (weatherCondition.includes("snow")) setWeatherIcon("❄️");
          else if (weatherCondition.includes("thunder")) setWeatherIcon("⛈️");
          else setWeatherIcon("🌡️");
        }
      } else {
        console.log("Weather data structure unexpected:", weatherData);
        setTemperature("--°C");
        setWeatherIcon("🌡️");
      }
    } catch (error) {
      console.log("Error fetching weather:", error);
      setTemperature("--°C");
      setWeatherIcon("🌡️");
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > swipeThreshold) {
          handlePrevDay();
        } else if (gestureState.dx < -swipeThreshold) {
          handleNextDay();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Top section with gradient background */}
      <View style={styles.topSection}>
        {/* Header - month/year */}
        <View style={styles.headerRow}>
          <Text style={styles.locationText}>{location}</Text>
          <TouchableOpacity onPress={handleMonthYearPress}>
            <Text style={styles.monthYearText}>
              📅 Tháng {month} - {year}
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>➡️</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Weather info */}
        <View style={styles.weatherRow}>
          <Text style={styles.weatherText}>
            {weatherIcon} {temperature}
          </Text>
        </View>

        {/* Big date in center with Vietnamese folk art background */}
        <View style={styles.bigDateSection}>
          {/* Background pattern with multiple emojis */}
          <View style={styles.patternBackground}>
            {[...Array(12)].map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.patternEmoji,
                  {
                    left: `${(i * 30 + 10) % 90}%`,
                    top: `${(i * 25 + 15) % 80}%`,
                    transform: [{ rotate: `${(i * 30) % 360}deg` }],
                  },
                ]}
              >
                {backgroundPattern.emoji}
              </Text>
            ))}
          </View>

          {/* Date content */}
          <View style={styles.dateContent}>
            <Text style={styles.bigDateNumber}>{day}</Text>
            <Text style={styles.dayOfWeekText}>{dayOfWeek.toUpperCase()}</Text>
          </View>
        </View>

        {/* Proverb at bottom */}
        <View style={styles.proverbBottomSection}>
          <Text style={styles.proverbBottomText}>{proverb}</Text>
          <Text style={styles.proverbAuthor}>Khuyết danh</Text>
        </View>
      </View>

      {/* Bottom white section with tabs */}
      <View style={styles.bottomSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>GIỜ</Text>
            <Text style={styles.infoValue}>
              {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, "0")}
            </Text>
            <Text style={styles.infoSubtext}>{dayCanChi.split(" ")[0]}</Text>
          </View>

          <View style={[styles.infoItem, styles.infoItemActive]}>
            <Text style={styles.infoLabel}>NGÀY ●</Text>
            <Text style={styles.infoValue}>{lunar.day}</Text>
            <Text style={styles.infoSubtext}>Mậu Ngọ</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>THÁNG</Text>
            <Text style={styles.infoValue}>{lunar.month}</Text>
            <Text style={styles.infoSubtext}>Đinh Hợi</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>NĂM</Text>
            <Text style={styles.infoValue}>{year}</Text>
            <Text style={styles.infoSubtext}>Ất Tỵ</Text>
          </View>
        </View>

        {/* Scrollable content area */}
        <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>
          {/* Ngày lễ */}
          {holidays.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎉 Ngày lễ</Text>
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
            <Text style={styles.sectionTitle}>⏰ Giờ Hoàng đạo</Text>
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

          {/* Sự kiện sắp tới */}
          {isToday && upcomingEvents.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.sectionTitle}>📅 Sự kiện sắp tới</Text>
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

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(1900, 0, 1)}
          locale="vi-VN"
          textColor="#1A237E"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    flex: 6,
    backgroundColor: "#FFE5B4",
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  weatherRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  weatherText: {
    fontSize: 16,
    color: "#333",
  },
  bigDateSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    position: "relative",
    overflow: "hidden",
  },
  patternBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.15,
  },
  patternEmoji: {
    position: "absolute",
    fontSize: 60,
    opacity: 0.6,
  },
  dateContent: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  bigDateNumber: {
    fontSize: 160,
    fontWeight: "bold",
    color: "#1A237E",
    lineHeight: 160,
  },
  dayOfWeekText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginTop: -5,
  },
  proverbBottomSection: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  proverbBottomText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  proverbAuthor: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#666",
    textAlign: "right",
    alignSelf: "flex-end",
  },
  bottomSection: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#f44336",
    paddingBottom: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  infoSubtext: {
    fontSize: 12,
    color: "#888",
  },
  detailsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  holidayItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
  },
  holidayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  publicHolidayDot: {
    backgroundColor: "#f44336",
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  publicHolidayText: {
    color: "#d32f2f",
  },
  holidayType: {
    fontSize: 12,
    color: "#888",
  },
  gioHoangDaoSection: {
    marginBottom: 20,
  },
  gioHoangDaoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gioItem: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gioIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  gioName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  gioTime: {
    fontSize: 11,
    color: "#888",
  },
  upcomingSection: {
    marginBottom: 30,
  },
  upcomingEventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
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
