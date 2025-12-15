# Script setup Android Environment Variables
# Chạy script này sau khi đã cài Android Studio

$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Android Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Android SDK có tồn tại không
if (Test-Path $ANDROID_HOME) {
    Write-Host "Android SDK da duoc tim thay tai: $ANDROID_HOME" -ForegroundColor Green
    
    # Set bien moi truong cho session hien tai
    $env:ANDROID_HOME = $ANDROID_HOME
    $env:Path += ";$ANDROID_HOME\platform-tools"
    $env:Path += ";$ANDROID_HOME\emulator"
    $env:Path += ";$ANDROID_HOME\tools"
    $env:Path += ";$ANDROID_HOME\tools\bin"
    
    Write-Host "Da set bien moi truong cho session hien tai" -ForegroundColor Green
    Write-Host ""
    Write-Host "De set vinh vien, chay lenh sau voi quyen Admin:" -ForegroundColor Yellow
    Write-Host '[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "' + $ANDROID_HOME + '", "User")' -ForegroundColor White
    Write-Host '$Path = [System.Environment]::GetEnvironmentVariable("Path", "User")' -ForegroundColor White
    Write-Host ('$Path += ";' + $ANDROID_HOME + '\platform-tools;' + $ANDROID_HOME + '\emulator;' + $ANDROID_HOME + '\tools;' + $ANDROID_HOME + '\tools\bin"') -ForegroundColor White
    Write-Host '[System.Environment]::SetEnvironmentVariable("Path", $Path, "User")' -ForegroundColor White
    Write-Host ""
    
    # Kiem tra adb
    Write-Host "Kiem tra ADB..." -ForegroundColor Cyan
    & "$ANDROID_HOME\platform-tools\adb.exe" version
    
    Write-Host ""
    Write-Host "Liet ke cac emulator co san:" -ForegroundColor Cyan
    & "$ANDROID_HOME\emulator\emulator.exe" -list-avds
    
} else {
    Write-Host "Khong tim thay Android SDK!" -ForegroundColor Red
    Write-Host "Vui long cai dat Android Studio truoc:" -ForegroundColor Yellow
    Write-Host "https://developer.android.com/studio" -ForegroundColor White
    Write-Host ""
    Write-Host "Sau khi cai xong, chay lai script nay." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
