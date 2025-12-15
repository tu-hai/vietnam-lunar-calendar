import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar, TouchableOpacity, Text } from "react-native";
import DayView from "./components/DayView";
import MonthView from "./components/MonthView";
import EventsView from "./components/EventsView";
import InfoView from "./components/InfoView";

export default function App() {
  const [activeTab, setActiveTab] = useState<"day" | "month" | "events" | "info">("day");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setActiveTab("day");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "day":
        return <DayView initialDate={selectedDate} />;
      case "month":
        return <MonthView />;
      case "events":
        return <EventsView onDateSelect={handleDateSelect} />;
      case "info":
        return <InfoView />;
      default:
        return <DayView initialDate={selectedDate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>{renderContent()}</View>

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={[styles.navItem, activeTab === "day" && styles.navItemActive]} onPress={() => setActiveTab("day")}>
          <Text style={[styles.navIcon, activeTab === "day" && styles.navIconActive]}>📅</Text>
          <Text style={[styles.navLabel, activeTab === "day" && styles.navLabelActive]}>Lịch ngày</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === "month" && styles.navItemActive]} onPress={() => setActiveTab("month")}>
          <Text style={[styles.navIcon, activeTab === "month" && styles.navIconActive]}>🗓️</Text>
          <Text style={[styles.navLabel, activeTab === "month" && styles.navLabelActive]}>Lịch tháng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === "events" && styles.navItemActive]} onPress={() => setActiveTab("events")}>
          <Text style={[styles.navIcon, activeTab === "events" && styles.navIconActive]}>📝</Text>
          <Text style={[styles.navLabel, activeTab === "events" && styles.navLabelActive]}>Sự kiện</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, activeTab === "info" && styles.navItemActive]} onPress={() => setActiveTab("info")}>
          <Text style={[styles.navIcon, activeTab === "info" && styles.navIconActive]}>ℹ️</Text>
          <Text style={[styles.navLabel, activeTab === "info" && styles.navLabelActive]}>Thông tin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 5,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: "transparent",
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#4CAF50",
    fontWeight: "600",
  },
});
