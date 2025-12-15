import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  viewMode: "week" | "month";
  onToggleView: () => void;
}

export default function MonthYearSelector({ month, year, onPrevMonth, onNextMonth, onToday, viewMode, onToggleView }: MonthYearSelectorProps) {
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPrevMonth}>
        <Text style={styles.buttonText}>◀</Text>
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Text style={styles.monthYear}>
          {monthNames[month - 1]} {year}
        </Text>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.todayButton} onPress={onToday}>
            <Text style={styles.todayText}>Hôm nay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={onToggleView}>
            <Text style={styles.toggleText}>{viewMode === "week" ? "Tháng" : "Tuần"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onNextMonth}>
        <Text style={styles.buttonText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  todayButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 16,
  },
  todayText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
  },
  toggleText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
});
