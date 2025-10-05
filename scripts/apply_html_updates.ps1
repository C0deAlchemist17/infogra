$ErrorActionPreference = 'Stop'

function Replace-InFileExact {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Old,
    [Parameter(Mandatory=$true)][string]$New
  )
  $text = Get-Content -LiteralPath $Path -Raw
  if (-not $text.Contains($Old)) {
    Write-Warning "Pattern not found in $Path; skipping one hunk"
    return $false
  }
  $text = $text.Replace($Old, $New)
  Set-Content -LiteralPath $Path -Value $text -Encoding UTF8
  return $true
}

# 1) Switch counters background to WebP in both pages
$idx = 'index.html'
$idxar = 'indexar.html'
(Get-Content $idx -Raw).Replace('assets/img/counters-bg.jpg','assets/img_opt/counters-bg.webp') | Set-Content $idx -Encoding UTF8
(Get-Content $idxar -Raw).Replace('assets/img/counters-bg.jpg','assets/img_opt/counters-bg.webp') | Set-Content $idxar -Encoding UTF8

# 2) Wrap images in index.html with <picture>
$indexPath = 'index.html'

# about logo
$old = @"
                          <img
                            src="assets/img/MY LOGO 002.png"
                            class="img-fluid rounded b-shadow-a"
                            alt=""
                            loading="lazy" decoding="async"
                          />
"@
$new = @"
                          <picture>
                            <source srcset="assets/img_opt/MY LOGO 002.webp" type="image/webp" />
                            <img
                              src="assets/img/MY LOGO 002.png"
                              class="img-fluid rounded b-shadow-a"
                              alt=""
                              loading="lazy" decoding="async"
                            />
                          </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# work-1
$old = '                    <img src="assets/img/work-1.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
                    <picture>
                      <source srcset="assets/img_opt/work-1.webp" type="image/webp" />
                      <img src="assets/img/work-1.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />
                    </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# work-2
$old = '                    <img src="assets/img/work-2.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
                    <picture>
                      <source srcset="assets/img_opt/work-2.webp" type="image/webp" />
                      <img src="assets/img/work-2.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />
                    </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# re ramen en screenshot
$old = '                    <img src="assets/img/re ramen en/Screenshot 2025-10-05 003904.png" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
                    <picture>
                      <source srcset="assets/img_opt/re ramen en/Screenshot 2025-10-05 003904.webp" type="image/webp" />
                      <img src="assets/img/re ramen en/Screenshot 2025-10-05 003904.png" alt="" class="img-fluid" loading="lazy" decoding="async" />
                    </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# maazen en screenshot
$old = '                    <img src="assets/img/maazen en/Screenshot 2025-10-05 015252.png" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
                    <picture>
                      <source srcset="assets/img_opt/maazen en/Screenshot 2025-10-05 015252.webp" type="image/webp" />
                      <img src="assets/img/maazen en/Screenshot 2025-10-05 015252.png" alt="" class="img-fluid" loading="lazy" decoding="async" />
                    </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# hab en screenshot
$old = '                    <img src="assets/img/hab en/Screenshot 2025-09-18 190357.png" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
                    <picture>
                      <source srcset="assets/img_opt/hab en/Screenshot 2025-09-18 190357.webp" type="image/webp" />
                      <img src="assets/img/hab en/Screenshot 2025-09-18 190357.png" alt="" class="img-fluid" loading="lazy" decoding="async" />
                    </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# work-4
$old = '              <img src="assets/img/work-4.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
              <picture>
                <source srcset="assets/img_opt/work-4.webp" type="image/webp" />
                <img src="assets/img/work-4.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />
              </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

# work-5
$old = '              <img src="assets/img/work-5.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />'
$new = @"
              <picture>
                <source srcset="assets/img_opt/work-5.webp" type="image/webp" />
                <img src="assets/img/work-5.jpg" alt="" class="img-fluid" loading="lazy" decoding="async" />
              </picture>
"@
[void](Replace-InFileExact -Path $indexPath -Old $old -New $new)

Write-Host 'HTML updates applied.'

# Report size deltas for heaviest assets
$report = @()
function Rpt { param([string]$orig,[string]$opt)
  $o = if(Test-Path $orig){ (Get-Item $orig).Length } else { $null }
  $p = if(Test-Path $opt){ (Get-Item $opt).Length } else { $null }
  [pscustomobject]@{ original=$orig; original_kb = if($o){ [math]::Round($o/1kb,1)} else {$null}; optimized=$opt; optimized_kb = if($p){ [math]::Round($p/1kb,1)} else {$null}; saved_kb = if($o -and $p){ [math]::Round(($o-$p)/1kb,1)} else {$null} }
}
$report += Rpt 'assets/img/work-1.jpg' 'assets/img_opt/work-1.webp'
$report += Rpt 'assets/img/work-2.jpg' 'assets/img_opt/work-2.webp'
$report += Rpt 'assets/img/work-3.jpg' 'assets/img_opt/work-3.webp'
$report += Rpt 'assets/img/work-4.jpg' 'assets/img_opt/work-4.webp'
$report += Rpt 'assets/img/work-5.jpg' 'assets/img_opt/work-5.webp'
$report += Rpt 'assets/img/counters-bg.jpg' 'assets/img_opt/counters-bg.webp'
$report += Rpt 'assets/img/re ramen en/Screenshot 2025-10-05 003904.png' 'assets/img_opt/re ramen en/Screenshot 2025-10-05 003904.webp'
$report += Rpt 'assets/img/maazen en/Screenshot 2025-10-05 015252.png' 'assets/img_opt/maazen en/Screenshot 2025-10-05 015252.webp'
$report += Rpt 'assets/img/hab en/Screenshot 2025-09-18 190357.png' 'assets/img_opt/hab en/Screenshot 2025-09-18 190357.webp'
$report | Format-Table -AutoSize | Out-String | Write-Host

# Video sizes
$ov = if(Test-Path 'assets/img/mylivewallpapers.com-Sphere-Wire-Mesh-1.mp4'){ (Get-Item 'assets/img/mylivewallpapers.com-Sphere-Wire-Mesh-1.mp4').Length } else { $null }
$mp4 = if(Test-Path 'assets/img_opt/hero-1280.mp4'){ (Get-Item 'assets/img_opt/hero-1280.mp4').Length } else { $null }
$webm = if(Test-Path 'assets/img_opt/hero-1280.webm'){ (Get-Item 'assets/img_opt/hero-1280.webm').Length } else { $null }
Write-Host ('Video original MP4 (KB): ' + (if($ov){ [math]::Round($ov/1kb,1)} else {'n/a'}))
Write-Host ('Optimized MP4 (KB): ' + (if($mp4){ [math]::Round($mp4/1kb,1)} else {'n/a'}))
Write-Host ('Optimized WebM (KB): ' + (if($webm){ [math]::Round($webm/1kb,1)} else {'n/a'}))
