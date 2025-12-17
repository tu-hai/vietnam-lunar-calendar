/**
 * Thuật toán chuyển đổi Dương lịch sang Âm lịch
 * Dựa trên thuật toán của Hồ Ngọc Đức
 */

import { CAN_NAMES, CHI_NAMES, LUNAR_MONTH_NAMES, LUNAR_DAY_NAMES, GIO_HOANG_DAO_TABLE, TIME_RANGES, ZODIAC_ICONS } from "./constants";

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

const PI = Math.PI;

// Tính số ngày Julius từ ngày/tháng/năm dương lịch
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

// Chuyển đổi từ số ngày Julius sang ngày/tháng/năm dương lịch
function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { day, month, year };
}

// Tính kinh độ mặt trời (Độ)
function SunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;

  // Normalize L to [0, 2PI)
  L = L - 2 * PI * Math.floor(L / (2 * PI));

  return Math.floor((L / PI) * 6);
}

// ... unchanged helpers ...

// Chuyển đổi từ dương lịch sang âm lịch
export function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone: number = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  let currentK = k + 1;

  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
    currentK = k;
  }

  // Find a11 (Start of Month 11 - Lunar Month containing Winter Solstice)
  // Search back from currentK
  let a11 = 0;
  let k11 = 0;

  // Logic: Search back 14 months for the month containing Dong Chi (Sun Index 9)
  // We check indices of Start and End of each month
  for (let n = currentK; n >= currentK - 14; n--) {
    const M1 = getNewMoonDay(n, timeZone);
    const M2 = getNewMoonDay(n + 1, timeZone);
    const L1 = getSunLongitudeIndex(M1, timeZone);
    const L2 = getSunLongitudeIndex(M2, timeZone);

    // Month 11 contains Dong Chi (Index 9)
    // Check if the interval [M1, M2) contains the transition to Index 9
    // or starts with Index 9 (Dong Chi starts exactly at month start)
    if ((L1 < 9 && L2 >= 9) || L1 === 9) {
      // Check validity: Major term must be WITHIN month.
      // Usually verified by L1 and L2 comparison.
      // If L1=9, month starts IN Dong Chi.
      // Previous month might be 11?
      // Let's stick to standard condition L1 < 9 && L2 >= 9?
      // But if L2 jumps 8->10? then L2>=9 holds.
      // Correct.
      a11 = M1;
      k11 = n;
      break;
    }
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = currentK - k11; // Exact difference in lunations
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (lunarMonth > 12) {
    // Check for leap year
    // Calculate b11 (Next Month 11) to confirm leap year existence
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);

    // Check if we passed the leap month
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    } else {
      lunarMonth = diff + 11;
    }

    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
  }

  let lunarYear = yy;
  // Year adjustment: If month is 11 or 12 and we are "early" in the solar year?
  // No, Lunar Year changes at Tet (Month 1).
  // If we are in Month 11/12, we are at END of a lunar year.
  // This lunar year corresponds to the Solar Year where it started?
  // E.g. Month 11 of 2025 corresponds to 2025?
  // Month 11 starts Dec 20, 2025.
  // It belongs to Year At Ty (2025).
  // So year = yy.
  // BUT if we are in Jan 2026. yy=2026.
  // Month 12 (ends Feb 16 2026).
  // Still Year At Ty (2025).
  // So if current solar year is 2026, but lunar month > 10, decrement year.

  if (lunarMonth >= 11 && diff < 4) {
    // If we are close to a11 (Winter Solstice), we are in Month 11/12.
    // And if solar year has advanced?
    // Dong Chi is always Dec.
    // If monthStart is Jan or Feb (yy increased), but it is Month 12.
    // Then we must be in yy-1 lunar wise.
    // How to detect?
    // a11 is Dec of Year Y.
    // If lunarMonth >= 11...
    // Usually if month > 10, it implies we are finishing the previous lunar year?
    // No. Month 11 is aligned with Dec.
    // If today is Dec 17 2025. yy=2025. lunar=10.
    // lunarYear should be 2025.
    // If today is Jan 20 2026. yy=2026. lunar=12.
    // lunarYear should be 2025.
    // So if (lunarMonth >= 11 && diff < 4)?
    // No. Month 11 (Solstice month) is ALWAYS in Year Y (Dec).
    // So if we are in Month 11 or 12, and we are in Jan/Feb?
    // Let's use standard logic:
    // Lunar Year = Solar Year of the Month 1 (Tet).
    // If current month is 11/12, it belongs to year of a11?
    // a11 is always in year Y.
    // So lunarYear should be year of a11??
    // jdToDate(a11).year?
    // Yes. a11 JDN -> Solar Date -> Year.
    // Dec 2024 -> 2024.
    // So Lunar Year is 2024?
    // Wait. At Ty 2025 started Jan 29 2025.
    // Dec 17 2025 is in At Ty (2025).
    // a11 found is Dec 21 2025? (Month 11 of 2025).
    // No, we found month 11 of 2025 is Dec 2025.
    // So a11 year is 2025.
    // So lunarYear = 2025.
    // What about Jan 2026? Month 12.
    // a11 is Dec 2025.
    // a11 year is 2025.
    // Lunar Year = 2025.
    // What about Jan 2025? Month 12 of 2024.
    // a11 is Dec 2024.
    // a11 year is 2024.
    // Lunar Year = 2024.
    // So simple rule: lunarYear = year of a11.
    // But verify getNewMoonDay(k11) -> JDN -> Date.
    // Optimized check:
    // Usually a11 falls in Dec.
  }

  // Use a11 year logic
  const a11Date = jdToDate(a11);
  lunarYear = a11Date.year;

  // Wait.
  // Dong Chi 2024 -> Dec 2024.
  // Lunar Year beginning NEXT month (Feb 2025).
  // So Month 11 belongs to previous year?
  // Month 11 of Giap Thin (2024) is Dec 2024.
  // Month 1 of At Ty (2025) is Jan 2025.
  // So Month 11 belongs to 2024.
  // So lunarYear = 2024.

  // Dec 17 2025.
  // a11 found is Dec 2025? (Month 11 of 2025???)
  // Month 11 of 2025 (At Ty) corresponds to Dec 2025.
  // So lunarYear = 2025.
  // BUT Month 11 of At Ty is LATE in the year.
  // Month 11 (Dong Chi) is the key anchor.
  // Month 11 is ALWAYS the 11th month.
  // So if we find Month 11, it is 11th month of CURRENT Lunar Year.
  // So Year is determined by a11 year?
  // a11 (Dec 2025) -> Year 2025.
  // a11 (Dec 2024) -> Year 2024.
  // Correct.

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    jd: dayNumber,
  };
}

// Chuyển đổi từ âm lịch sang dương lịch
export function convertLunar2Solar(lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap: boolean, timeZone: number = 7): { day: number; month: number; year: number } {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = jdFromDate(31, 12, lunarYear - 1);
    b11 = jdFromDate(31, 12, lunarYear);
  } else {
    a11 = jdFromDate(31, 12, lunarYear);
    b11 = jdFromDate(31, 12, lunarYear + 1);
  }

  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;

  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 };
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

// Lấy tên Can
export function getCanName(num: number): string {
  // num=0 -> Canh (index 6 in CAN_NAMES)
  return CAN_NAMES[(num + 6) % 10];
}

// Lấy tên Chi
// Lấy tên Chi
export function getChiName(num: number): string {
  // num=0 -> Thân (index 8 in CHI_NAMES ["Tý", ... "Thân"...])
  // CHI_NAMES: Tý(0), Sửu(1), Dân(2), Mão(3), Thìn(4), Tỵ(5), Ngọ(6), Mùi(7), Thân(8), Dậu(9), Tuất(10), Hợi(11)
  // Original: ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"]
  // num=0 -> Thân.
  // Using CHI_NAMES: (num + 8) % 12 ?
  // If num=0 -> 8 -> Thân. Correct.
  return CHI_NAMES[(num + 8) % 12];
}

// Lấy tên Giáp Tý (năm âm lịch)
export function getYearCanChi(year: number): string {
  return `${getCanName(year + 6)} ${getChiName(year + 8)}`;
}

// Lấy tên tháng âm lịch
// Lấy tên tháng âm lịch
export function getMonthName(lunarMonth: number, lunarLeap: boolean): string {
  const name = LUNAR_MONTH_NAMES[lunarMonth - 1];
  return lunarLeap ? `${name} (Nhuận)` : name;
}

// Lấy tên ngày âm lịch
// Lấy tên ngày âm lịch
export function getDayName(lunarDay: number): string {
  if (lunarDay <= 10) {
    return LUNAR_DAY_NAMES[lunarDay - 1];
  }
  if (lunarDay === 20 || lunarDay === 30) {
    return `Ngày ${lunarDay}`;
  }
  return `Ngày ${lunarDay}`;
}

// Lấy Can Chi của ngày
// Lấy Can Chi của ngày
export function getDayCanChi(jd: number): string {
  return CAN_NAMES[(jd + 9) % 10] + " " + CHI_NAMES[(jd + 1) % 12];
}

// Giờ hoàng đạo theo Can của ngày
export interface GioHoangDao {
  gio: string;
  canChi: string;
  thoiGian: string;
  icon: string;
}

export function getGioHoangDao(day: number, month: number, year: number): GioHoangDao[] {
  const lunar = convertSolar2Lunar(day, month, year);
  const jd = lunar.jd;
  const dayCanIndex = (jd + 9) % 10;

  // Bảng giờ hoàng đạo theo Can của ngày
  const canGroup = dayCanIndex % 5;
  const hoangDaoHours = GIO_HOANG_DAO_TABLE[canGroup];

  const result: GioHoangDao[] = [];
  for (const hour of hoangDaoHours) {
    result.push({
      gio: CHI_NAMES[hour],
      canChi: CHI_NAMES[hour],
      thoiGian: TIME_RANGES[hour],
      icon: ZODIAC_ICONS[hour],
    });
  }

  return result;
}
