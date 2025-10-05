param(
  [string]$FfmpegPath
)

$ErrorActionPreference = 'Stop'

# Locate ffmpeg
$ff = $null
if ($FfmpegPath -and (Test-Path $FfmpegPath)) {
  $ff = (Resolve-Path $FfmpegPath).Path
} else {
  $candidates = @(
    (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\ffmpeg.exe'),
    'C:\Program Files\ffmpeg\bin\ffmpeg.exe',
    'C:\Program Files (x86)\ffmpeg\bin\ffmpeg.exe'
  )
  foreach ($p in $candidates) {
    if (Test-Path $p) { $ff = $p; break }
  }
  if (-not $ff) {
    $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($cmd) { $ff = $cmd.Source }
  }
}
if (-not $ff) { Write-Error 'ffmpeg not found in provided path, common locations, or PATH'; exit 1 }
Write-Host "Using ffmpeg:`n$ff"

# Ensure output root exists
$dstRoot = 'assets\img_opt'
New-Item -ItemType Directory -Force -Path $dstRoot | Out-Null
# Helper to convert to WebP with max width
function Convert-ToWebP {
  param(
    [Parameter(Mandatory=$true)][string]$Src,
    [Parameter(Mandatory=$true)][int]$MaxWidth = 1600,
    [Parameter(Mandatory=$true)][int]$Quality = 28
  )
  if (-not (Test-Path $Src)) { return }
  $srcRoot = (Resolve-Path 'assets\img').Path
  $absSrc = (Resolve-Path $Src).Path
  $rel = $absSrc.Substring($srcRoot.Length).TrimStart('\\')
  $outDir = Join-Path $dstRoot ([IO.Path]::GetDirectoryName($rel))
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  $nameNoExt = [IO.Path]::GetFileNameWithoutExtension($absSrc)
  $dst = Join-Path $outDir ($nameNoExt + '.webp')
  $scaleExpr = "scale=w='if(gt(iw,$MaxWidth),$MaxWidth,iw)':h=-2"
  & $ff -y -i $absSrc -vf $scaleExpr -q:v $Quality $dst
  Write-Host "Converted: $rel -> $dst"
}

# Key images referenced in index pages
$images = @(
  'assets\img\work-1.jpg',
  'assets\img\work-2.jpg',
  'assets\img\work-3.jpg',
  'assets\img\work-4.jpg',
  'assets\img\work-5.jpg',
  'assets\img\MY LOGO 002.png',
  'assets\img\counters-bg.jpg',
  'assets\img\hab en\Screenshot 2025-09-18 190357.png',
  'assets\img\re ramen en\Screenshot 2025-10-05 003904.png',
  'assets\img\maazen en\Screenshot 2025-10-05 015252.png',
  'assets\img\re ramen ar\Screenshot 2025-10-05 005747.png',
  'assets\img\maazen ar\Screenshot 2025-10-05 014905.png'
)

foreach ($img in $images) {
  if ($img -match 'work-[345]\.jpg$') {
    Convert-ToWebP -Src $img -MaxWidth 1200 -Quality 30
  } elseif ($img -match 'MY LOGO 002\.png$') {
    Convert-ToWebP -Src $img -MaxWidth 800 -Quality 32
  } else {
    Convert-ToWebP -Src $img -MaxWidth 1600 -Quality 28
  }
}

# Video transcode and poster
$videoSrc = 'assets\img\mylivewallpapers.com-Sphere-Wire-Mesh-1.mp4'
if (Test-Path $videoSrc) {
  & $ff -y -i $videoSrc -vf 'scale=1280:-2' -c:v libx264 -crf 23 -preset veryfast -movflags +faststart -c:a aac -b:a 128k 'assets\img_opt\hero-1280.mp4'
  & $ff -y -i $videoSrc -vf 'scale=1280:-2' -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -c:a libopus -b:a 96k 'assets\img_opt\hero-1280.webm'
  & $ff -y -ss 2 -i $videoSrc -frames:v 1 -vf 'scale=1280:-2' 'assets\img_opt\hero-poster.jpg'
  Write-Host 'Video and poster generated.'
} else {
  Write-Warning 'Hero video not found; skipping.'
}

Write-Host 'Optimization complete.'
