import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet, View, Image } from "react-native";
import DayView from "../components/DayView";
import MonthView from "../components/MonthView";
import EventsView from "../components/EventsView";
import InfoView from "../components/InfoView";
import ScreenWrapper from "../components/ScreenWrapper";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

const Tab = createBottomTabNavigator();

// Wrapped Components for Transition
const DayScreen = (props: any) => (
  <ScreenWrapper>
    <DayView {...props} />
  </ScreenWrapper>
);
const MonthScreen = (props: any) => (
  <ScreenWrapper>
    <MonthView {...props} />
  </ScreenWrapper>
);
const EventsScreen = (props: any) => (
  <ScreenWrapper>
    <EventsView {...props} />
  </ScreenWrapper>
);
const InfoScreen = (props: any) => (
  <ScreenWrapper>
    <InfoView {...props} />
  </ScreenWrapper>
);

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        freezeOnBlur: true,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Hide default labels to use custom ones if needed, or just icons
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let label;
          const isDayTab = route.name === Strings.calendarDay;

          switch (route.name) {
            case Strings.calendarDay:
              iconSource = require("../assets/icon.png");
              label = "Ngày";
              break;
            case Strings.calendarMonth:
              label = "Tháng";
              break;
            case Strings.events:
              label = "Sự kiện";
              break;
            case Strings.info:
              label = "Thông tin";
              break;
            default:
              label = "Tab";
          }

          // Fallback emojis for other tabs if we don't have images yet
          let iconEmoji;
          if (route.name === Strings.calendarMonth) iconEmoji = "🗓️";
          if (route.name === Strings.events) iconEmoji = "✨";
          if (route.name === Strings.info) iconEmoji = "ℹ️";

          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              {isDayTab ? (
                <Image source={iconSource} style={[styles.tabIconImage, focused && styles.tabIconImageActive]} resizeMode="contain" />
              ) : (
                <Text style={[styles.icon, focused && styles.iconActive]}>{iconEmoji}</Text>
              )}
              {focused ? <Text style={styles.labelActive}>{label}</Text> : <Text style={styles.labelInactive}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name={Strings.calendarDay} component={DayScreen} />
      <Tab.Screen name={Strings.calendarMonth} component={MonthScreen} />
      <Tab.Screen name={Strings.events} component={EventsScreen} />
      <Tab.Screen name={Strings.info} component={InfoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 50,
    borderTopWidth: 0,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    paddingBottom: 0, // Override default padding
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Slightly wider for inactive labels
    height: 50,
  },
  iconContainerActive: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 25,
    width: 110, // Expand width for label
    flexDirection: "row", // Show icon and label side by side
    alignItems: "center",
    justifyContent: "center",
    top: 6, // Float slightly higher
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    height: 50,
  },
  icon: {
    fontSize: 24,
    marginBottom: 0,
  },
  tabIconImage: {
    width: 24,
    height: 24,
    marginBottom: 0,
    borderRadius: 4,
  },
  tabIconImageActive: {
    width: 20,
    height: 20,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: "white", // Small border effect to make it pop against dark blue
  },
  iconActive: {
    fontSize: 20,
    marginRight: 6,
    marginBottom: 0,
    color: Colors.white, // Ensure icon is white when active
  },
  labelActive: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  labelInactive: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "500",
  },
});
