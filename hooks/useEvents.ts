import { useMemo } from "react";
import { getHolidaysForDate } from "../utils/holidays";

export interface MonthlyEvent {
  day: number;
  month: number;
  year: number;
  holiday: any;
}

export function useMonthlyEvents(month: number, year: number) {
  const events = useMemo(() => {
    const eventsList: MonthlyEvent[] = [];

    // Get number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Iterate through each day of the solar month
    for (let day = 1; day <= daysInMonth; day++) {
      // getHolidaysForDate returns both solar and lunar holidays for this specific solar date
      const holidays = getHolidaysForDate(day, month, year);

      holidays.forEach((holiday) => {
        eventsList.push({
          day,
          month,
          year,
          holiday,
        });
      });
    }

    return eventsList.sort((a, b) => a.day - b.day);
  }, [month, year]);

  return events;
}
