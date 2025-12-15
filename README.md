# Ứng dụng Lịch Âm Dương (Việt Nam)

Ứng dụng lịch âm dương với các ngày lễ Việt Nam được xây dựng bằng React Native và TypeScript.

## Tính năng

- 📅 Hiển thị lịch dương và âm đồng thời
- 🎉 Đánh dấu các ngày lễ Việt Nam (dương lịch và âm lịch)
- 🔴 Phân biệt ngày nghỉ công
- 📱 Giao diện thân thiện, dễ sử dụng
- 🌙 Hiển thị chi tiết ngày âm lịch (Can Chi, tên tháng)
- 👆 Xem chi tiết thông tin khi nhấn vào ngày

## Ngày lễ được hỗ trợ

### Ngày lễ dương lịch:

- Tết Dương lịch (01/01)
- Ngày thành lập Đảng (03/02)
- Quốc tế Phụ nữ (08/03)
- Giải phóng miền Nam (30/04)
- Quốc tế Lao động (01/05)
- Quốc khánh (02/09)
- Và nhiều ngày lễ khác...

### Ngày lễ âm lịch:

- Tết Nguyên Đán (01/01 ÂL)
- Giỗ Tổ Hùng Vương (10/03 ÂL)
- Tết Đoan Ngọ (05/05 ÂL)
- Vu Lan (15/07 ÂL)
- Tết Trung Thu (15/08 ÂL)
- Và nhiều ngày lễ khác...

## Cài đặt

### Yêu cầu

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Expo CLI

### Các bước cài đặt

1. Cài đặt các dependencies:

```bash
npm install
```

2. Chạy ứng dụng:

**Trên iOS Simulator:**

```bash
npm run ios
```

**Trên Android Emulator:**

```bash
npm run android
```

**Trên Web:**

```bash
npm run web
```

**Hoặc sử dụng Expo Go:**

```bash
npm start
```

Sau đó quét mã QR bằng ứng dụng Expo Go trên điện thoại.

## Cấu trúc dự án

```
.
├── components/           # Các React components
│   ├── DateCell.tsx     # Component ô ngày
│   ├── CalendarGrid.tsx # Component lưới lịch
│   ├── MonthYearSelector.tsx # Component chọn tháng/năm
│   └── DateDetailModal.tsx   # Modal chi tiết ngày
├── utils/               # Các hàm tiện ích
│   ├── lunarCalendar.ts # Thuật toán chuyển đổi âm lịch
│   └── holidays.ts      # Danh sách ngày lễ
├── App.tsx              # Component chính
├── app.json             # Cấu hình Expo
├── package.json         # Dependencies
└── tsconfig.json        # Cấu hình TypeScript
```

## Thuật toán

Ứng dụng sử dụng thuật toán chuyển đổi dương lịch sang âm lịch dựa trên:

- Tính toán vị trí mặt trời và mặt trăng
- Múi giờ Việt Nam (GMT+7)

## Công nghệ sử dụng

- React Native
- TypeScript
- Expo

## License

MIT License

## Tác giả

Phát triển bởi Võ Tứ Hải
