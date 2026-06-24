<#
.SYNOPSIS
    Read-only diagnostic for double-encoded UTF-8 ("mojibake") text in a file.
    Makes NO changes to the file. Pure-ASCII script source on purpose, so it
    can't get corrupted by Windows reading it with the wrong codepage.

.PARAMETER Path
    Path to the file to inspect (e.g. math_knowledge.jsx).

.EXAMPLE
    .\Inspect-Mojibake.ps1 -Path ".\math_knowledge.jsx"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

if (-not (Test-Path $Path)) {
    Write-Error "File not found: $Path"
    exit 1
}

# ---- 1. BOM check ----
$rawBytes = [System.IO.File]::ReadAllBytes($Path)
$hasUtf8Bom = $rawBytes.Length -ge 3 -and $rawBytes[0] -eq 0xEF -and $rawBytes[1] -eq 0xBB -and $rawBytes[2] -eq 0xBF

Write-Host "=== FILE INFO ===" -ForegroundColor Cyan
Write-Host "Path:       $Path"
Write-Host "Size:       $($rawBytes.Length) bytes"
Write-Host "UTF-8 BOM:  $hasUtf8Bom"
Write-Host ""

# ---- 2. Decode as UTF-8 (what your editor/Node/browser currently sees) ----
$content = [System.Text.Encoding]::UTF8.GetString($rawBytes)
$lines = $content -split "`r?`n"

# Build suspect patterns from numeric char codes (NOT literal text) so this
# script file itself stays pure ASCII and can't get mangled.
$P1 = [string][char]0x00C2                                   # "A-circumflex" -> common mojibake lead char
$P2 = [string]([char]0x00E2) + [string][char]0x20AC          # a-circumflex + euro sign -> classic smart-quote mojibake
$P3 = [string][char]0x00C3                                   # "A-tilde" -> common mojibake lead char
$P4 = [string][char]0x00F0                                   # "eth" -> lead char for emoji mojibake

$suspectPatterns = @($P1, $P2, $P3, $P4)

$hits = New-Object System.Collections.Generic.List[object]
for ($i = 0; $i -lt $lines.Count; $i++) {
    foreach ($p in $suspectPatterns) {
        if ($lines[$i].Contains($p)) {
            $hits.Add([pscustomobject]@{ LineNum = $i + 1; Line = $lines[$i].Trim() })
            break
        }
    }
}

Write-Host "=== SCAN RESULT ===" -ForegroundColor Cyan
Write-Host "Lines with suspected mojibake: $($hits.Count) / $($lines.Count)"
Write-Host ""

if ($hits.Count -eq 0) {
    Write-Host "No mojibake patterns detected with current heuristics." -ForegroundColor Yellow
    exit 0
}

# ---- 3. Show first few offending lines ----
Write-Host "=== SAMPLE LINES (first 5) ===" -ForegroundColor Cyan
$hits | Select-Object -First 5 | ForEach-Object {
    Write-Host ("Line {0}: {1}" -f $_.LineNum, $_.Line)
}
Write-Host ""

# ---- 4. Codepoint dump of one sample line (numbers only, fully ASCII-safe) ----
$sample = $hits[0].Line
Write-Host "=== CODEPOINTS (line $($hits[0].LineNum), first 12 chars) ===" -ForegroundColor Cyan
$chars = $sample.ToCharArray()
for ($i = 0; $i -lt $chars.Count -and $i -lt 12; $i++) {
    $code = [int]$chars[$i]
    "{0,3}: U+{1}  (decimal {2})" -f $i, ([Convert]::ToString($code,16).PadLeft(4,'0').ToUpper()), $code
}
Write-Host ""

# ---- 5. Test repair hypotheses WITHOUT writing anything ----
# Hypothesis A: bytes were originally UTF-8, got misread as Windows-1252 (CP1252),
# then re-saved as UTF-8. To reverse: re-encode the garbled string as CP1252 bytes,
# then decode those bytes as UTF-8.
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)
$testBytesCp1252 = $cp1252.GetBytes($sample)
$repairCp1252 = [System.Text.Encoding]::UTF8.GetString($testBytesCp1252)

# Hypothesis B: same idea but with pure Latin-1 (ISO-8859-1) instead of CP1252.
$latin1 = [System.Text.Encoding]::GetEncoding(28591)
$testBytesLatin1 = $latin1.GetBytes($sample)
$repairLatin1 = [System.Text.Encoding]::UTF8.GetString($testBytesLatin1)

Write-Host "=== REPAIR HYPOTHESIS TEST (preview only, nothing saved) ===" -ForegroundColor Cyan
Write-Host "Current (broken):"
Write-Host "  $sample"
Write-Host ""
Write-Host "Repaired via CP1252 -> UTF-8:"
Write-Host "  $repairCp1252"
Write-Host ""
Write-Host "Repaired via Latin-1 -> UTF-8:"
Write-Host "  $repairLatin1"
Write-Host ""

Write-Host "=== HOW TO READ THIS ===" -ForegroundColor Yellow
Write-Host "- Compare the 'Current', 'CP1252' and 'Latin-1' lines above."
Write-Host "- Whichever one actually shows correct symbols (real math signs,"
Write-Host "  degree signs, square roots, emoji, etc.) tells us the right repair."
Write-Host "- Paste this whole output back and we'll pick the right fix."
