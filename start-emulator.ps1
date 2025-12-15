# Quick Start Script - Chạy Android Emulator và Expo

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Khởi động Android Emulator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

if (Test-Path $ANDROID_HOME) {
    # Lấy danh sách emulator
    $avds = & "$ANDROID_HOME\emulator\emulator.exe" -list-avds
    
    if ($avds) {
        Write-Host "Các emulator có sẵn:" -ForegroundColor Green
        $avds | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
        Write-Host ""
        
        # Lấy emulator đầu tiên
        $firstAvd = $avds[0]
        Write-Host "Đang khởi động emulator: $firstAvd ..." -ForegroundColor Yellow
        Write-Host ""
        
        # Khởi động emulator trong background
        Start-Process -FilePath "$ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", $firstAvd -WindowStyle Normal
        
        Write-Host "✓ Emulator đang khởi động (có thể mất 1-2 phút)" -ForegroundColor Green
        Write-Host ""
        Write-Host "Sau khi emulator đã mở, chạy lệnh:" -ForegroundColor Cyan
        Write-Host "  npm start" -ForegroundColor White
        Write-Host "Rồi nhấn 'a' để mở app trên Android" -ForegroundColor White
        
    } else {
        Write-Host "✗ Không tìm thấy emulator nào!" -ForegroundColor Red
        Write-Host "Vui lòng tạo emulator trong Android Studio:" -ForegroundColor Yellow
        Write-Host "  Tools → Device Manager → Create Device" -ForegroundColor White
    }
    
} else {
    Write-Host "✗ Android SDK chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Chạy script setup-android.ps1 trước" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
