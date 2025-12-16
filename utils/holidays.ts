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


export interface EventTheme {
  emoji: string;
  bg: string;
  border: string;
  iconColor: string;
}


export function getEventTheme(name: string): EventTheme {
  const lower = name.toLowerCase();

  // 1. TẾT NGUYÊN ĐÁN & MÙA XUÂN (Màu hồng/đỏ đào)
  // Bao gồm: Tết, Xuân, Năm mới, Giao thừa, Táo quân
  if (lower.includes("tết") || lower.includes("xuân") || lower.includes("năm mới") || lower.includes("giao thừa") || lower.includes("táo quân")) {
    return { emoji: "🌸", bg: "#FCE4EC", border: "#F8BBD0", iconColor: "#F48FB1" };
  }

  // 2. CÁC NGÀY LỄ YÊU NƯỚC & QUỐC GIA (Màu vàng/đỏ cờ)
  // Bao gồm: Quốc khánh (2/9), Thống nhất (30/4), Chiến thắng, Quân đội (22/12), Đảng, Điện Biên
  if (lower.includes("quốc khánh") || lower.includes("thống nhất") || lower.includes("chiến thắng") || lower.includes("quân đội") || lower.includes("đảng") || lower.includes("điện biên")) {
    return { emoji: "⭐", bg: "#FFF8E1", border: "#FFECB3", iconColor: "#FBC02D" };
  }

  // 3. GIÁNG SINH (Màu xanh lá cây)
  if (lower.includes("noel") || lower.includes("giáng sinh")) {
    return { emoji: "🎄", bg: "#F1F8E9", border: "#C8E6C9", iconColor: "#2E7D32" };
  }

  // 4. PHỤ NỮ & TÌNH YÊU (Màu hồng đậm/đỏ)
  // Bao gồm: 8/3, 20/10, Valentine, Ngày của Mẹ
  if (lower.includes("phụ nữ") || lower.includes("tình yêu") || lower.includes("valentine") || lower.includes("mẹ")) {
    return { emoji: "🌹", bg: "#F8BBD0", border: "#F48FB1", iconColor: "#D81B60" };
  }

  // 5. GIÁO DỤC & NHÀ GIÁO (Màu cam đất/tri thức)
  // Bao gồm: 20/11, Nhà giáo, Khai giảng, Tốt nghiệp
  if (lower.includes("nhà giáo") || lower.includes("thầy cô") || lower.includes("khai giảng") || lower.includes("tốt nghiệp")) {
    return { emoji: "🎓", bg: "#FFF3E0", border: "#FFE0B2", iconColor: "#EF6C00" };
  }

  // 6. TRẺ EM & TRUNG THU (Màu tím/vàng sáng vui tươi)
  // Bao gồm: 1/6, Thiếu nhi, Trung thu, Rằm
  if (lower.includes("thiếu nhi") || lower.includes("trẻ em") || lower.includes("trung thu") || lower.includes("trăng")) {
    return { emoji: "🎈", bg: "#F3E5F5", border: "#E1BEE7", iconColor: "#AB47BC" };
  }

  // 7. Y TẾ & SỨC KHỎE (Màu xanh dương nhạt)
  // Bao gồm: 27/2, Thầy thuốc, Y tế, Điều dưỡng
  if (lower.includes("thầy thuốc") || lower.includes("y tế") || lower.includes("sức khỏe") || lower.includes("hiến máu")) {
    return { emoji: "⚕️", bg: "#E3F2FD", border: "#BBDEFB", iconColor: "#1976D2" };
  }

  // 8. LAO ĐỘNG & CÔNG ĐOÀN (Màu xanh công nhân)
  // Bao gồm: 1/5, Lao động
  if (lower.includes("lao động") || lower.includes("công nhân") || lower.includes("công đoàn")) {
    return { emoji: "🛠️", bg: "#E0F7FA", border: "#B2EBF2", iconColor: "#0097A7" };
  }

  // 9. THƯƠNG BINH LIỆT SĨ & TƯỞNG NIỆM (Màu trầm trang nghiêm)
  // Bao gồm: 27/7, Thương binh, Liệt sĩ
  if (lower.includes("thương binh") || lower.includes("liệt sĩ") || lower.includes("tưởng niệm")) {
    return { emoji: "🎗️", bg: "#ECEFF1", border: "#CFD8DC", iconColor: "#607D8B" }; // Màu xám xanh
  }

  // 10. TÂM LINH & TRUYỀN THỐNG (Màu nâu/cam phật giáo)
  // Bao gồm: Giỗ tổ, Phật đản, Vu lan
  if (lower.includes("giỗ tổ") || lower.includes("hùng vương") || lower.includes("phật") || lower.includes("vu lan")) {
    return { emoji: "🏮", bg: "#FFF8E1", border: "#FFECB3", iconColor: "#E65100" };
  }

  // 11. DOANH NHÂN & BÁO CHÍ (Màu xanh đậm chuyên nghiệp)
  if (lower.includes("doanh nhân") || lower.includes("báo chí")) {
    return { emoji: "✒️", bg: "#E8EAF6", border: "#C5CAE9", iconColor: "#3949AB" };
  }

  // 12. HALLOWEEN (Màu cam bí ngô)
  if (lower.includes("halloween") || lower.includes("hóa trang")) {
    return { emoji: "🎃", bg: "#FFF3E0", border: "#FFCC80", iconColor: "#F57C00" };
  }

  // MẶC ĐỊNH
  return { emoji: "📅", bg: "#FAFAFA", border: "#E0E0E0", iconColor: "#9E9E9E" };
}