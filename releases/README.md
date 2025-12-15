# Releases

Thư mục này chứa các file build APK của ứng dụng Lịch Âm Dương.

## Hướng dẫn

### Build APK

Sau khi build xong, copy file APK vào thư mục này với tên theo format:

```
LichAmDuong-v[version]-[date].apk
```

Ví dụ:

- `LichAmDuong-v1.0.0-20251215.apk`
- `LichAmDuong-v1.0.1-20251220.apk`

### Build bằng EAS

```bash
eas build --platform android --profile preview
```

### Build local

```bash
npm run android:build
```

## Phát hành phiên bản mới trên GitHub

### Bước 1: Tạo Release trên GitHub

```bash
# 1. Đẩy code lên GitHub
git add .
git commit -m "Release v1.0.1"
git push origin main

# 2. Tạo tag
git tag v1.0.1
git push origin v1.0.1
```

### Bước 2: Upload APK lên GitHub Releases

1. Vào https://github.com/tu-hai/vietnam-lunar-calendar/releases
2. Click "Create a new release"
3. Chọn tag vừa tạo (v1.0.1)
4. Điền thông tin:
   - Release title: `v1.0.1 - Tên phiên bản`
   - Description: Mô tả các tính năng mới, sửa lỗi
5. Upload file APK từ thư mục `releases/`
6. Click "Publish release"

### Bước 3: Người dùng sẽ được thông báo

- Người dùng mở app → Tab Thông tin → Nhấn "Kiểm tra cập nhật"
- App sẽ kiểm tra GitHub API và thông báo nếu có phiên bản mới
- Hiển thị link tải về từ GitHub Releases

## Tự động kiểm tra phiên bản mới

App có thể tự động kiểm tra bằng cách:

1. Gọi GitHub API: `https://api.github.com/repos/tu-hai/vietnam-lunar-calendar/releases/latest`
2. So sánh version hiện tại với version mới nhất
3. Hiển thị thông báo cập nhật nếu có bản mới

## Lưu ý

- File APK thường có dung lượng 20-50 MB
- Không commit file APK lên Git (đã thêm vào .gitignore)
- Upload file APK lên GitHub Releases khi phát hành phiên bản mới
- Tăng version trong `app.json` và `InfoView.tsx` trước khi build
