import { useMemo } from "react";

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

interface UseCalendarMatrixProps {
  month: number;
  year: number;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  viewMode: "week" | "month";
}

export function useCalendarMatrix({
  month,
  year,
  selectedDay,
  selectedMonth,
  selectedYear,
  viewMode,
}: UseCalendarMatrixProps) {
  return useMemo(() => {
    const today = new Date();
    
    // Nếu chế độ tuần, tính tuần hiện tại dựa trên ngày được chọn
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const selectedDayOfWeek = selectedDate.getDay();

    // Lấy ngày đầu tiên của tháng
    const firstDay = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...

    // Lấy số ngày trong tháng
    const daysInMonth = new Date(year, month, 0).getDate();

    // Lấy số ngày của tháng trước
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

    // Tạo mảng các ngày để hiển thị
    const days: CalendarDay[] = [];

    if (viewMode === "week") {
      // Chế độ tuần: Hiển thị 7 ngày từ Chủ nhật đến Thứ 7
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDayOfWeek);

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);

        days.push({
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          isCurrentMonth: currentDate.getMonth() + 1 === month,
        });
      }
    } else {
      // Chế độ tháng: Hiển thị toàn bộ tháng
      // Thêm các ngày của tháng trước
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          day: daysInPrevMonth - i,
          month: prevMonth,
          year: prevYear,
          isCurrentMonth: false,
        });
      }

      // Thêm các ngày của tháng hiện tại
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          day,
          month,
          year,
          isCurrentMonth: true,
        });
      }

      // Thêm các ngày của tháng sau
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const remainingDays = 42 - days.length; // 6 tuần x 7 ngày = 42 ngày
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          day,
          month: nextMonth,
          year: nextYear,
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [month, year, selectedDay, selectedMonth, selectedYear, viewMode]);
}
