$ErrorActionPreference = 'Stop'

# Prepare folders
New-Item -ItemType Directory -Force -Path 'scripts' | Out-Null
New-Item -ItemType Directory -Force -Path 'scripts\tools' | Out-Null

# Download portable FFmpeg (Gyan.dev essentials build)
$ffzip = 'scripts\tools\ffmpeg.zip'
$ffdir = 'scripts\tools\ffmpeg'
$url   = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'

Write-Host "Downloading FFmpeg from $url ..."
Invoke-WebRequest -Uri $url -OutFile $ffzip

# Extract
Write-Host "Extracting FFmpeg ..."
if (Test-Path $ffdir) { Remove-Item -Recurse -Force $ffdir }
Expand-Archive -Path $ffzip -DestinationPath $ffdir -Force
Remove-Item $ffzip -Force

# Locate ffmpeg.exe inside extracted folder
$ff = Get-ChildItem -Path $ffdir -Recurse -Filter ffmpeg.exe | Select-Object -First 1 -ExpandProperty FullName
if (-not $ff) { throw 'ffmpeg.exe not found after extraction' }
Write-Host "Using ffmpeg:`n$ff"

# Run optimizer with explicit ffmpeg path
Write-Host 'Running optimizer...'
& powershell -NoProfile -ExecutionPolicy Bypass -File 'scripts\optimize.ps1' -FfmpegPath $ff
