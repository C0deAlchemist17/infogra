# Fix Arabic text encoding in indexar.html
$filePath = "c:\Users\cyper tech\Documents\GitHub\infogra\indexar.html"

# Read as Latin1 to get the raw bytes correctly
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$latin1 = [System.Text.Encoding]::GetEncoding('ISO-8859-1')
$utf8 = [System.Text.Encoding]::UTF8

# Decode as Latin1 then re-encode as UTF8
$text = $latin1.GetString($bytes)
$properUtf8Bytes = $utf8.GetBytes($text)

# Write back as UTF8
[System.IO.File]::WriteAllBytes($filePath, $properUtf8Bytes)

Write-Host "Arabic encoding fixed successfully!" -ForegroundColor Green
