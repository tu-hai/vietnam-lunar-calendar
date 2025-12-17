import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DayView from "../components/DayView";
import MonthView from "../components/MonthView";
import EventsView from "../components/EventsView";
import InfoView from "../components/InfoView";
import ScreenWrapper from "../components/ScreenWrapper";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

const Tab = createBottomTabNavigator();

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
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "calendar";
          let label = "";

          switch (route.name) {
            case Strings.calendarDay:
              iconName = focused ? "today" : "today-outline";
              label = "Ngày";
              break;
            case Strings.calendarMonth:
              iconName = focused ? "calendar" : "calendar-outline";
              label = "Tháng";
              break;
            case Strings.events:
              iconName = focused ? "star" : "star-outline";
              label = "Sự kiện";
              break;
            case Strings.info:
              iconName = focused ? "information-circle" : "information-circle-outline";
              label = "Thông tin";
              break;
          }

          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Ionicons name={iconName} size={24} color={focused ? Colors.redAccent : Colors.textMuted} style={styles.icon} />
              {!focused && <Text numberOfLines={1}>{label}</Text>}
              {focused && (
                <Text style={styles.labelActive} numberOfLines={1}>
                  {label}
                </Text>
              )}
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
    left: 0,
    right: 0,
    elevation: 8,
    backgroundColor: Colors.white,
    borderRadius: 0,
    height: 50,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 50,
    borderRadius: 20,
  },
  iconContainerActive: {

  },
  icon: {
    marginBottom: 0,
  },
  iconActive: {
    color: Colors.redAccent,
  },
  labelActive: {
    color: Colors.redAccent,
   // fontSize: 13,
    fontWeight: "700",
   // marginLeft: 4,
  },
});
