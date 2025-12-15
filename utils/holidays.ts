import { convertSolar2Lunar } from "./lunarCalendar";

export interface Holiday {
  name: string;
  date?: string; // Dạng MM-DD cho ngày dương lịch
  lunarDate?: string; // Dạng MM-DD cho ngày âm lịch
  isLunar: boolean;
  isPublicHoliday: boolean;
}

export const vietnamHolidays: Holiday[] = [
  // Ngày lễ dương lịch
  {
    name: "Tết Dương lịch",
    date: "01-01",
    isLunar: false,
    isPublicHoliday: true,
  },
  {
    name: "Ngày thành lập Đảng Cộng sản Việt Nam",
    date: "02-03",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày Quốc tế Phụ nữ",
    date: "03-08",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày Giải phóng miền Nam",
    date: "04-30",
    isLunar: false,
    isPublicHoliday: true,
  },
  {
    name: "Ngày Quốc tế Lao động",
    date: "05-01",
    isLunar: false,
    isPublicHoliday: true,
  },
  {
    name: "Ngày Quốc tế Thiếu nhi",
    date: "06-01",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày Gia đình Việt Nam",
    date: "06-28",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày Thương binh - Liệt sĩ",
    date: "07-27",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Cách mạng Tháng Tám",
    date: "08-19",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Quốc khánh",
    date: "09-02",
    isLunar: false,
    isPublicHoliday: true,
  },
  {
    name: "Ngày Nhà giáo Việt Nam",
    date: "11-20",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày Quốc tế Nhân quyền",
    date: "12-10",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Ngày thành lập Quân đội Nhân dân Việt Nam",
    date: "12-22",
    isLunar: false,
    isPublicHoliday: false,
  },
  {
    name: "Giáng sinh",
    date: "12-25",
    isLunar: false,
    isPublicHoliday: false,
  },

  // Ngày lễ âm lịch
  {
    name: "Tết Nguyên Đán",
    lunarDate: "01-01",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Mùng 2 Tết",
    lunarDate: "01-02",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Mùng 3 Tết",
    lunarDate: "01-03",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Mùng 4 Tết",
    lunarDate: "01-04",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Mùng 5 Tết",
    lunarDate: "01-05",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Rằm tháng Giêng",
    lunarDate: "01-15",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Tết Hàn thực",
    lunarDate: "03-03",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Giỗ Tổ Hùng Vương",
    lunarDate: "03-10",
    isLunar: true,
    isPublicHoliday: true,
  },
  {
    name: "Phật Đản",
    lunarDate: "04-15",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Tết Đoan Ngọ",
    lunarDate: "05-05",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Vu Lan",
    lunarDate: "07-15",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Tết Trung Thu",
    lunarDate: "08-15",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Tết Trùng Cửu",
    lunarDate: "09-09",
    isLunar: true,
    isPublicHoliday: false,
  },
  {
    name: "Tết Ông Công Ông Táo",
    lunarDate: "12-23",
    isLunar: true,
    isPublicHoliday: false,
  },
];

// Lấy các ngày lễ cho một ngày cụ thể
export function getHolidaysForDate(day: number, month: number, year: number): Holiday[] {
  const holidays: Holiday[] = [];
  const dateStr = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Kiểm tra ngày lễ dương lịch
  const solarHolidays = vietnamHolidays.filter((h) => !h.isLunar && h.date === dateStr);
  holidays.push(...solarHolidays);

  // Kiểm tra ngày lễ âm lịch
  const lunar = convertSolar2Lunar(day, month, year);
  const lunarDateStr = `${String(lunar.month).padStart(2, "0")}-${String(lunar.day).padStart(2, "0")}`;

  // Lọc sự kiện âm lịch với logic đặc biệt cho các ngày cuối năm và đầu năm âm
  const lunarHolidays = vietnamHolidays.filter((h) => {
    if (!h.isLunar || h.lunarDate !== lunarDateStr) return false;

    // Nếu là các ngày Tết (tháng 1 âm lịch), chỉ hiển thị khi dương lịch trong khoảng tháng 1-2
    if (h.lunarDate?.startsWith("01-")) {
      return month === 1 || month === 2;
    }

    // Nếu là các ngày tháng Chạp (tháng 12 âm lịch), chỉ hiển thị khi dương lịch trong khoảng tháng 12-1-2
    // (vì tháng Chạp năm cũ có thể trùng với tháng 9-11 dương lịch của năm trước)
    if (h.lunarDate?.startsWith("12-")) {
      return month === 12 || month === 1 || month === 2;
    }

    return true;
  });
  holidays.push(...lunarHolidays);

  return holidays;
}

// Kiểm tra xem có phải ngày lễ không
export function isHoliday(day: number, month: number, year: number): boolean {
  return getHolidaysForDate(day, month, year).length > 0;
}

// Kiểm tra xem có phải ngày nghỉ công không
export function isPublicHoliday(day: number, month: number, year: number): boolean {
  const holidays = getHolidaysForDate(day, month, year);
  return holidays.some((h) => h.isPublicHoliday);
}

// Lấy các sự kiện sắp tới trong tháng
export interface UpcomingEvent {
  holiday: Holiday;
  day: number;
  month: number;
  year: number;
  daysUntil: number;
}

export function getUpcomingEventsInMonth(currentDay: number, currentMonth: number, currentYear: number): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

  // Lấy số ngày trong tháng hiện tại
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Duyệt qua các ngày còn lại trong tháng
  for (let day = currentDay + 1; day <= daysInMonth; day++) {
    const holidays = getHolidaysForDate(day, currentMonth, currentYear);

    if (holidays.length > 0) {
      const eventDate = new Date(currentYear, currentMonth - 1, day);
      const daysUntil = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      holidays.forEach((holiday) => {
        events.push({
          holiday,
          day,
          month: currentMonth,
          year: currentYear,
          daysUntil,
        });
      });
    }
  }

  // Sắp xếp theo số ngày gần nhất
  return events.sort((a, b) => a.daysUntil - b.daysUntil);
}
