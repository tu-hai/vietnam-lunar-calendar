import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, LayoutAnimation, UIManager, InteractionManager, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertSolar2Lunar, getYearCanChi, getGioHoangDao, getDayCanChi } from "../utils/lunarCalendar";
import { useLocation } from "../hooks/useLocation";
import { useWeather } from "../hooks/useWeather";
import { useSwipeGesture, useVerticalSwipeGesture } from "../hooks/useSwipeGesture";
import { getHolidaysForDate, getUpcomingEventsInMonth, getEventTheme } from "../utils/holidays";
import { getProverbForDate } from "../utils/proverbs";
import { VIETNAMESE_FOLK_IMAGES, WEEK_DAYS } from "../utils/constants";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";
import HolidaySection from "./HolidaySection";
import ZodiacHoursSection from "./ZodiacHoursSection";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface DayViewProps {
  route?: any; // Add route prop which comes from React Navigation
  initialDate?: Date | null;
}

export default function DayView({ route, initialDate }: DayViewProps) {
  const today = new Date();
  // Get date from route params if available (from MonthView/EventsView navigation), otherwise use props or default to today
  const paramDate = route?.params?.date ? new Date(route.params.date) : null;
  const [selectedDate, setSelectedDate] = useState(paramDate || initialDate || today);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInteractionsComplete, setIsInteractionsComplete] = useState(false);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setIsInteractionsComplete(true);
    });
    return () => interactionPromise.cancel();
  }, []);

  // Update selectedDate when route params change
  useEffect(() => {
    if (route?.params?.date) {
      setSelectedDate(new Date(route.params.date));
    } else if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [route?.params?.date, initialDate]);

  const swipeThreshold = 50;

  // Custom hooks
  const { location, coordinates } = useLocation();
  const { temperature, weatherIcon } = useWeather(coordinates);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const day = selectedDate.getDate();
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  // Memoize expensive calculations
  const lunar = useMemo(() => convertSolar2Lunar(day, month, year), [day, month, year]);
  const holidays = useMemo(() => getHolidaysForDate(day, month, year), [day, month, year]);
  const yearCanChi = useMemo(() => getYearCanChi(lunar.year), [lunar.year]);
  const dayCanChi = useMemo(() => getDayCanChi(lunar.jd), [lunar.jd]);
  const gioHoangDao = useMemo(() => getGioHoangDao(day, month, year), [day, month, year]);

  const dayOfWeek = useMemo(() => WEEK_DAYS[selectedDate.getDay()], [selectedDate]);

  const upcomingEvents = useMemo(() => getUpcomingEventsInMonth(day, month, year), [day, month, year]);

  const proverb = useMemo(() => getProverbForDate(day, month, year), [day, month, year]);

  // Vietnamese folk art patterns/emojis
  const vietnameseFolkImages = useMemo(() => VIETNAMESE_FOLK_IMAGES, []);

  // Select background based on date (consistent for same date)
  const backgroundPattern = useMemo(() => {
    const index = (day + month + year) % vietnameseFolkImages.length;
    return vietnameseFolkImages[index];
  }, [day, month, year, vietnameseFolkImages]);

  // Handler for background pattern items to avoid inline mapping if possible
  const backgroundItems = useMemo(
    () =>
      [...Array(8)].map((_, i) => ({
        key: i,
        style: {
          left: `${(i * 45 + 10) % 90}%`,
          top: `${(i * 35 + 5) % 80}%`,
          transform: [{ rotate: `${(i * 45) % 360}deg` }, { scale: 1.2 }],
          opacity: 0.1,
        },
      })),
    []
  );

  // Optimized Handlers
  const handlePrevDay = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }

    if (event.type === "dismissed" && Platform.OS === "ios") {
      setShowDatePicker(false);
    }
  }, []);

  const handleMonthYearPress = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const lunarContent = (
    <View style={styles.lunarStatusRow}>
      <Text style={styles.canChiDay}>Ngày {dayCanChi}</Text>
    </View>
  );
  // Vertical Swipe Handlers
  const handleSwipeUp = useCallback(() => {
    if (!isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const handleSwipeDown = useCallback(() => {
    if (isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(false);
    }
  }, [isExpanded]);

  // Swipe gesture handlers
  const panResponder = useSwipeGesture(handleNextDay, handlePrevDay, swipeThreshold);
  const verticalPanResponder = useVerticalSwipeGesture(handleSwipeUp, handleSwipeDown, 30); // 30 threshold for easier vertical swipe

  if (!isInteractionsComplete) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top section with gradient-like background */}
      <View style={[styles.topSection, isExpanded ? styles.topSectionCollapsed : styles.topSectionExpanded]} {...panResponder.panHandlers}>
        {/* Header - month/year & Location */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleMonthYearPress} style={styles.dateSelector}>
            <Text style={styles.dateSelectorText}>
              {Strings.month} {month} / {year}
            </Text>
            <Text style={styles.dateSelectorIcon}>▼</Text>
          </TouchableOpacity>

          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
              📍 {location} {weatherIcon} {temperature}
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={isExpanded ? styles.expandedContentContainer : undefined}>
          {/* Big date in center */}
          <View style={[styles.bigDateSection, isExpanded && styles.bigDateSectionCollapsed]}>
            {/* Background pattern */}
            {!isExpanded && (
              <View style={styles.patternBackground}>
                {backgroundItems.map((item: any) => (
                  <Text key={item.key} style={[styles.patternEmoji, item.style]}>
                    {backgroundPattern.emoji}
                  </Text>
                ))}
              </View>
            )}

            {/* Date content */}
            <View style={styles.dateContent}>
              <Text style={[styles.dayOfWeekText, isExpanded && styles.dayOfWeekTextCollapsed]}>{dayOfWeek}</Text>
              <Text style={[styles.bigDateNumber, isExpanded && styles.bigDateNumberCollapsed]}>
                {day}
                {/* If expanded, render inside the Text component */}
                {isExpanded && lunarContent}
              </Text>
              {/* If NOT expanded, render outside as a sibling */}
              {!isExpanded && lunarContent}
            </View>
          </View>
        </View>

        {/* Proverb */}
        {!isExpanded && (
          <View style={styles.proverbContainer}>
            <Text style={styles.proverbText}>“{proverb}”</Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet Style Content */}
      <View style={[styles.bottomSheet, isExpanded ? styles.bottomSheetExpanded : styles.bottomSheetCollapsed]}>
        {/* Header - Swipeable Area */}
        <View {...verticalPanResponder.panHandlers}>
          {/* Lunar Info Grid - Redesigned */}
          <View style={styles.lunarInfoContainer}>
            <View style={styles.lunarInfoCard}>
              <Text style={styles.lunarInfoIcon}>🌙</Text>
              <View>
                <Text style={styles.lunarInfoLabel}>{Strings.lunar}</Text>
                <Text style={styles.lunarInfoValue}>
                  {lunar.day}/{lunar.month}
                </Text>
              </View>
            </View>

            <View style={styles.lunarInfoCard}>
              <Text style={styles.lunarInfoIcon}>🕰️</Text>
              <View>
                <Text style={styles.lunarInfoLabel}>{Strings.hour}</Text>
                <Text style={styles.lunarInfoValue}>
                  {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, "0")}
                </Text>
              </View>
            </View>

            <View style={styles.lunarInfoCard}>
              <Text style={styles.lunarInfoIcon}>📅</Text>
              <View>
                <Text style={styles.lunarInfoLabel}>{Strings.yearLabel}</Text>
                <Text style={styles.lunarInfoValue}>{yearCanChi}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Scrollable Details */}
        <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>
          <HolidaySection holidays={holidays} />
          <ZodiacHoursSection gioHoangDao={gioHoangDao} />

          {upcomingEvents.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.sectionTitle}>
                {Strings.upcomingEvents} ({upcomingEvents.length})
              </Text>
              {upcomingEvents.map((event, index) => {
                const theme = getEventTheme(event.holiday.name);

                return (
                  <View key={index} style={[styles.upcomingEventItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    {/* Watermark Background */}
                    <View style={styles.eventWatermark}>
                      <Text style={[styles.eventWatermarkIcon, { color: theme.iconColor }]}>{theme.emoji}</Text>
                    </View>

                    <View style={styles.upcomingDayBadge}>
                      <Text style={styles.upcomingDayNumber}>{event.daysUntil}</Text>
                      <Text style={styles.upcomingDayLabel}>{Strings.daysUntilLabel}</Text>
                    </View>
                    <View style={styles.upcomingEventRight}>
                      <Text style={[styles.upcomingEventName, event.holiday.isPublicHoliday && styles.upcomingPublicHoliday]}>{event.holiday.name}</Text>
                      <Text style={styles.upcomingEventDate}>
                        {event.day}/{event.month} • {event.holiday.isLunar ? Strings.lunar : Strings.solar}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date(2050, 11, 31)}
          minimumDate={new Date(1945, 0, 1)}
          locale="vi-VN"
          textColor={Colors.darkBlue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.highlight, // Use highlight color directly for top background
  },
  topSection: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
    width: "100%",
  },
  topSectionExpanded: {
    flex: 1.2,
    paddingTop: 30,
  },
  topSectionCollapsed: {
    flex: 0.4,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: "center",
  },
  expandedContentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginRight: 6,
  },
  dateSelectorIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  locationBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  weatherFloating: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 8,
    borderRadius: 12,
  },
  weatherFloatingExpanded: {
    top: 100,
  },
  weatherText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
  },
  bigDateSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  patternBackground: {
    position: "absolute",
    width: "100%",
    height: 300,
    top: -50,
  },
  patternEmoji: {
    position: "absolute",
    fontSize: 80,
    color: Colors.primary,
  },
  dateContent: {
    alignItems: "center",
    zIndex: 2,
  },
  dayOfWeekText: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: -10,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  bigDateNumber: {
    fontSize: 120, // Smaller than 160 but bolder feel
    fontWeight: "800",
    color: Colors.darkBlue,
    includeFontPadding: false,
    lineHeight: 130,
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  bigDateNumberCollapsed: {
    fontSize: 60,
    lineHeight: 70,
  },
  bigDateSectionCollapsed: {
    marginTop: 5,
  },
  dayOfWeekTextCollapsed: {
    fontSize: 16,
    marginBottom: 0,
  },
  lunarStatusRow: {
    marginTop: 0,
    backgroundColor: Colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  canChiDay: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
  },
  proverbContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  proverbText: {
    fontSize: 16,
    fontStyle: "italic",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    width: "100%",
    paddingBottom: 20,
  },
  bottomSheetCollapsed: {
    flex: 1,
    marginTop: -20,
  },
  bottomSheetExpanded: {
    flex: 2, // Take up more space (approx 70%)
    marginTop: 0,
  },
  expandButton: {
    alignSelf: "center",
    padding: 5,
    marginBottom: 5,
  },
  expandIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: "bold",
  },
  lunarInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  lunarInfoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 12,
    // Shadow for depth
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lunarInfoIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  lunarInfoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 2,
  },
  lunarInfoValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  detailsScroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 15,
  },
  upcomingSection: {
    marginTop: 10,
  },
  upcomingEventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden", // Clip the watermark
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
    fontSize: 80,
  },
  upcomingDayBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 55,
    marginRight: 15,
  },
  upcomingDayNumber: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  upcomingPublicHoliday: {
    color: Colors.secondary,
  },
  upcomingEventDate: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
