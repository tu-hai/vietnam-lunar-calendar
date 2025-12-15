# Script setup Java Environment
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Java Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Tim JAVA_HOME
$JavaPath = Get-ChildItem "C:\Program Files\Eclipse Adoptium\" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "jdk-*" } | Select-Object -First 1

if ($JavaPath) {
    $JAVA_HOME = $JavaPath.FullName
    Write-Host "Tim thay Java JDK tai: $JAVA_HOME" -ForegroundColor Green
    
    # Set bien moi truong cho session hien tai
    $env:JAVA_HOME = $JAVA_HOME
    $env:Path += ";$JAVA_HOME\bin"
    
    Write-Host "Da set JAVA_HOME cho session hien tai" -ForegroundColor Green
    Write-Host ""
    Write-Host "De set vinh vien, chay lenh sau voi quyen Admin:" -ForegroundColor Yellow
    Write-Host "[System.Environment]::SetEnvironmentVariable('JAVA_HOME', '$JAVA_HOME', 'User')" -ForegroundColor White
    Write-Host '$Path = [System.Environment]::GetEnvironmentVariable("Path", "User")' -ForegroundColor White
    Write-Host ('$Path += ";' + $JAVA_HOME + '\bin"') -ForegroundColor White
    Write-Host '[System.Environment]::SetEnvironmentVariable("Path", $Path, "User")' -ForegroundColor White
    Write-Host ""
    
    # Kiem tra java
    Write-Host "Kiem tra Java version..." -ForegroundColor Cyan
    & "$JAVA_HOME\bin\java.exe" -version
    
} else {
    Write-Host "Khong tim thay Java JDK!" -ForegroundColor Red
    Write-Host "Vui long cai dat Java JDK 17:" -ForegroundColor Yellow
    Write-Host "https://adoptium.net/temurin/releases/?version=17" -ForegroundColor White
    Write-Host ""
    Write-Host "Sau khi cai xong, chay lai script nay." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
