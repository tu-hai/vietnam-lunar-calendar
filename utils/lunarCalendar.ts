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
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return Math.floor((L / PI) * 6);
}

// Tính thời điểm mặt trời đi vào trung khí thứ k kể từ Xuân phân
function getSunLongitude(dayNumber: number, timeZone: number): number {
  return Math.floor((SunLongitude(dayNumber - 0.5 - timeZone / 24) + 2) / 12);
}

// Tìm ngày có trung khí thứ k (từ 0 đến 11), k=0 là Xuân phân
function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

// Tìm ngày trung khí
function getSunLongitudeIndex(jdn: number, timeZone: number): number {
  return Math.floor((SunLongitude(jdn - 0.5 - timeZone / 24.0) / PI) * 6);
}

// Tìm tháng nhuận
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

// Chuyển đổi từ dương lịch sang âm lịch
export function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone: number = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);

  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getNewMoonDay(k - 1, timeZone);
  let b11 = a11;

  if (a11 >= monthStart) {
    const lunarYear = yy;
    a11 = getNewMoonDay(k - 12, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    const lunarYear = yy - 1;
    return {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      leap: lunarLeap,
      jd: dayNumber,
    };
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: yy,
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
