import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, StyleSheet, View, Platform } from "react-native";
import DayView from "../components/DayView";
import MonthView from "../components/MonthView";
import EventsView from "../components/EventsView";
import InfoView from "../components/InfoView";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Hide default labels to use custom ones if needed, or just icons
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          switch (route.name) {
            case Strings.calendarDay:
              iconName = "📅";
              label = "Ngày";
              break;
            case Strings.calendarMonth:
              iconName = "🗓️";
              label = "Tháng";
              break;
            case Strings.events:
              iconName = "✨";
              label = "Sự kiện";
              break;
            case Strings.info:
              iconName = "ℹ️";
              label = "Thông tin";
              break;
            default:
              iconName = "📅";
              label = "Tab";
          }

          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={[styles.icon, focused && styles.iconActive]}>{iconName}</Text>
              {focused ? <Text style={styles.labelActive}>{label}</Text> : <Text style={styles.labelInactive}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name={Strings.calendarDay} component={DayView} />
      <Tab.Screen name={Strings.calendarMonth} component={MonthView} />
      <Tab.Screen name={Strings.events} component={EventsView} />
      <Tab.Screen name={Strings.info} component={InfoView} />
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
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 110, // Expand width for label
    flexDirection: "row", // Show icon and label side by side
    alignItems: "center",
    justifyContent: "center",
    top: 0, // Float slightly higher
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
