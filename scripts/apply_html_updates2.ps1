$ErrorActionPreference = 'Stop'

function Set-FileContent {
  param([string]$Path,[string]$Content)
  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

# Load files
$idxPath   = 'index.html'
$idxarPath = 'indexar.html'
$idx   = Get-Content -LiteralPath $idxPath -Raw
$idxar = Get-Content -LiteralPath $idxarPath -Raw

# 1) index.html: wrap the about logo IMG with <picture> if not already wrapped
if ($idx -notmatch 'assets/img_opt/MY LOGO 002.webp') {
  $pattern = '(?<open><div\s+class="about-img">\s*)(?<img><img[^>]*src="assets/img/MY LOGO 002.png"[^>]*/>)(?<close>\s*</div>)'
  if ($idx -match $pattern) {
    $open  = $Matches['open']
    $img   = $Matches['img']
    $close = $Matches['close']
    # Ensure lazy/async on fallback img
    $img2 = $img
    if ($img2 -notmatch 'loading=') { $img2 = $img2 -replace '<img','<img loading="lazy" decoding="async"' }
    $picture = @"
${open}<picture>
  <source srcset="assets/img_opt/MY LOGO 002.webp" type="image/webp" />
  ${img2}
</picture>${close}
"@
    $rx = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $idx = $rx.Replace($idx, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $picture }, 1)
  }
}

# 2) indexar.html: add loading/decoding to non-critical images (about logo + portfolio img tags)
# Add attributes to all <img ... class="img-fluid" ...> that don't already have loading/decoding
$idxar = [System.Text.RegularExpressions.Regex]::Replace(
  $idxar,
  '<img(?![^>]*loading=)([^>]*class="[^"]*img-fluid[^"]*"[^>]*)/?>',
  '<img loading="lazy" decoding="async" $1/>',
  [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

# 3) indexar.html: defer vendor scripts (add defer to <script src=...> without defer)
$idxar = [System.Text.RegularExpressions.Regex]::Replace(
  $idxar,
  '<script(?![^>]*\bdefer\b)([^>]*\ssrc=)',
  '<script defer$1',
  [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

# Save files
Set-FileContent -Path $idxPath -Content $idx
Set-FileContent -Path $idxarPath -Content $idxar

Write-Host 'apply_html_updates2: Done.'
