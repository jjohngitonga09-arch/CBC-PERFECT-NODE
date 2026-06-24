# patch-diagrams.ps1
# ============================================================
# Injects inline SVG diagrams into geometry formulas inside
# frontend/src/pages/student/MathKnowledge.jsx
#
# Usage: .\patch-diagrams.ps1
# ============================================================

# ------------------------------------------------------------
# 1. Path to your component file
# ------------------------------------------------------------
$file = ".\frontend\src\pages\student\MathKnowledge.jsx"

if (-not (Test-Path $file)) {
    Write-Error "File not found: $file"
    exit 1
}

# ------------------------------------------------------------
# 2. Create a timestamped backup (just in case)
# ------------------------------------------------------------
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backup = "$file.$timestamp.bak"
Copy-Item $file $backup -Force
Write-Host "Backup created: $backup"

# ------------------------------------------------------------
# 3. Read the entire file
# ------------------------------------------------------------
$content = Get-Content $file -Raw -Encoding UTF8

# ------------------------------------------------------------
# 4. SVG Diagrams – keyed by the exact formula 'name'
# ------------------------------------------------------------
$diagrams = @{
    "Area of Parallelogram" = @"
<svg viewBox="0 0 120 80" width="120" height="80">
  <polygon points="20,10 100,10 80,70 0,70" fill="#e3f2fd" stroke="#1565c0" stroke-width="2" />
  <line x1="20" y1="10" x2="20" y2="70" stroke="#d32f2f" stroke-dasharray="4" stroke-width="1.5" />
  <line x1="10" y1="10" x2="10" y2="70" stroke="#d32f2f" stroke-width="1.5" />
  <text x="8" y="44" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
  <line x1="20" y1="75" x2="100" y2="75" stroke="#388e3c" stroke-width="1.5" />
  <text x="50" y="85" font-size="10" fill="#388e3c" font-family="sans-serif">base (b)</text>
</svg>
"@
    "Area of Trapezoid / Trapezium" = @"
<svg viewBox="0 0 120 80" width="120" height="80">
  <polygon points="30,10 90,10 100,70 20,70" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" />
  <line x1="30" y1="10" x2="20" y2="70" stroke="#d32f2f" stroke-dasharray="4" stroke-width="1.5" />
  <line x1="20" y1="10" x2="20" y2="70" stroke="#d32f2f" stroke-width="1.5" />
  <text x="12" y="44" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
  <text x="40" y="6" font-size="10" fill="#1565c0" font-family="sans-serif">a</text>
  <text x="88" y="6" font-size="10" fill="#1565c0" font-family="sans-serif">b</text>
</svg>
"@
    "Volume of Cuboid" = @"
<svg viewBox="0 0 120 90" width="120" height="90">
  <rect x="15" y="30" width="70" height="50" fill="#fff3e0" stroke="#e65100" stroke-width="2" />
  <line x1="85" y1="30" x2="105" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="85" y1="80" x2="105" y2="65" stroke="#e65100" stroke-width="2" />
  <line x1="15" y1="30" x2="35" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="70" y1="15" x2="105" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="35" y1="15" x2="70" y2="15" stroke="#e65100" stroke-width="2" />
  <text x="22" y="75" font-size="10" fill="#d32f2f" font-family="sans-serif">l</text>
  <text x="90" y="78" font-size="10" fill="#d32f2f" font-family="sans-serif">w</text>
  <text x="38" y="12" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
</svg>
"@
    "Volume of Cube" = @"
<svg viewBox="0 0 90 90" width="90" height="90">
  <rect x="10" y="30" width="50" height="50" fill="#e8eaf6" stroke="#283593" stroke-width="2" />
  <line x1="60" y1="30" x2="80" y2="15" stroke="#283593" stroke-width="2" />
  <line x1="60" y1="80" x2="80" y2="65" stroke="#283593" stroke-width="2" />
  <line x1="10" y1="30" x2="30" y2="15" stroke="#283593" stroke-width="2" />
  <line x1="30" y1="15" x2="80" y2="15" stroke="#283593" stroke-width="2" />
  <text x="28" y="75" font-size="10" fill="#d32f2f" font-family="sans-serif">s</text>
</svg>
"@
    "Area of Triangle" = @"
<svg viewBox="0 0 120 80" width="120" height="80">
  <polygon points="20,70 100,70 60,10" fill="#fce4ec" stroke="#b71c1c" stroke-width="2" />
  <line x1="60" y1="10" x2="60" y2="70" stroke="#d32f2f" stroke-dasharray="4" stroke-width="1.5" />
  <text x="64" y="44" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
  <line x1="20" y1="75" x2="100" y2="75" stroke="#388e3c" stroke-width="1.5" />
  <text x="50" y="85" font-size="10" fill="#388e3c" font-family="sans-serif">base (b)</text>
</svg>
"@
    "Area of a Circle" = @"
<svg viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#e3f2fd" stroke="#1565c0" stroke-width="2" />
  <line x1="50" y1="50" x2="90" y2="50" stroke="#d32f2f" stroke-width="1.5" />
  <text x="66" y="46" font-size="10" fill="#d32f2f" font-family="sans-serif">r</text>
</svg>
"@
    "Circumference of a Circle" = @"
<svg viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#1565c0" stroke-width="2" />
  <line x1="50" y1="50" x2="90" y2="50" stroke="#d32f2f" stroke-width="1.5" />
  <text x="66" y="46" font-size="10" fill="#d32f2f" font-family="sans-serif">r</text>
  <path d="M 40,10 A 40,40 0 0,1 80,30" fill="none" stroke="#e65100" stroke-width="2" stroke-dasharray="4" />
  <text x="42" y="4" font-size="8" fill="#e65100" font-family="sans-serif">circumference</text>
</svg>
"@
    "Pythagoras' Theorem" = @"
<svg viewBox="0 0 100 80" width="100" height="80">
  <polygon points="10,70 90,70 10,10" fill="#fff3e0" stroke="#e65100" stroke-width="2" />
  <rect x="10" y="70" width="4" height="4" fill="#d32f2f" />
  <line x1="10" y1="10" x2="90" y2="70" stroke="#d32f2f" stroke-width="2" stroke-dasharray="2" />
  <text x="30" y="62" font-size="10" fill="#d32f2f" font-family="sans-serif">a</text>
  <text x="78" y="58" font-size="10" fill="#388e3c" font-family="sans-serif">b</text>
  <text x="40" y="30" font-size="10" fill="#1565c0" font-family="sans-serif">c</text>
</svg>
"@
    "Volume of Cylinder" = @"
<svg viewBox="0 0 100 100" width="100" height="100">
  <ellipse cx="50" cy="20" rx="35" ry="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2" />
  <rect x="15" y="20" width="70" height="50" fill="none" stroke="#1565c0" stroke-width="2" />
  <ellipse cx="50" cy="70" rx="35" ry="10" fill="none" stroke="#1565c0" stroke-width="2" />
  <line x1="50" y1="20" x2="50" y2="70" stroke="#d32f2f" stroke-dasharray="4" stroke-width="1.5" />
  <text x="52" y="48" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
  <line x1="50" y1="20" x2="85" y2="20" stroke="#388e3c" stroke-width="1.5" />
  <text x="86" y="18" font-size="10" fill="#388e3c" font-family="sans-serif">r</text>
</svg>
"@
    "Volume of Cone" = @"
<svg viewBox="0 0 100 100" width="100" height="100">
  <ellipse cx="50" cy="70" rx="35" ry="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2" />
  <line x1="50" y1="10" x2="15" y2="70" stroke="#2e7d32" stroke-width="2" />
  <line x1="50" y1="10" x2="85" y2="70" stroke="#2e7d32" stroke-width="2" />
  <line x1="50" y1="10" x2="50" y2="70" stroke="#d32f2f" stroke-dasharray="4" stroke-width="1.5" />
  <text x="52" y="44" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
  <line x1="50" y1="70" x2="85" y2="70" stroke="#388e3c" stroke-width="1.5" />
  <text x="86" y="68" font-size="10" fill="#388e3c" font-family="sans-serif">r</text>
</svg>
"@
    "Volume of Sphere" = @"
<svg viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#f3e5f5" stroke="#6a1b9a" stroke-width="2" />
  <line x1="50" y1="50" x2="90" y2="50" stroke="#d32f2f" stroke-width="1.5" />
  <text x="66" y="46" font-size="10" fill="#d32f2f" font-family="sans-serif">r</text>
</svg>
"@
    "Surface Area of Cube" = @"
<svg viewBox="0 0 90 90" width="90" height="90">
  <rect x="10" y="30" width="50" height="50" fill="#e8eaf6" stroke="#283593" stroke-width="2" />
  <line x1="60" y1="30" x2="80" y2="15" stroke="#283593" stroke-width="2" />
  <line x1="60" y1="80" x2="80" y2="65" stroke="#283593" stroke-width="2" />
  <line x1="10" y1="30" x2="30" y2="15" stroke="#283593" stroke-width="2" />
  <line x1="30" y1="15" x2="80" y2="15" stroke="#283593" stroke-width="2" />
  <text x="28" y="75" font-size="10" fill="#d32f2f" font-family="sans-serif">s</text>
</svg>
"@
    "Surface Area of Cuboid" = @"
<svg viewBox="0 0 120 90" width="120" height="90">
  <rect x="15" y="30" width="70" height="50" fill="#fff3e0" stroke="#e65100" stroke-width="2" />
  <line x1="85" y1="30" x2="105" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="85" y1="80" x2="105" y2="65" stroke="#e65100" stroke-width="2" />
  <line x1="15" y1="30" x2="35" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="70" y1="15" x2="105" y2="15" stroke="#e65100" stroke-width="2" />
  <line x1="35" y1="15" x2="70" y2="15" stroke="#e65100" stroke-width="2" />
  <text x="22" y="75" font-size="10" fill="#d32f2f" font-family="sans-serif">l</text>
  <text x="90" y="78" font-size="10" fill="#d32f2f" font-family="sans-serif">w</text>
  <text x="38" y="12" font-size="10" fill="#d32f2f" font-family="sans-serif">h</text>
</svg>
"@
}

# ------------------------------------------------------------
# 5. Inject 'diagram' property into each matching formula object
# ------------------------------------------------------------
foreach ($name in $diagrams.Keys) {
    $svg = $diagrams[$name] -replace "`n", "`n  "   # indent for readability
    $pattern = "(?<=name: '$name',\s*)"
    $replacement = "`n  diagram: `$`"$svg`$`",`n  "
    $content = $content -replace $pattern, $replacement
}

# ------------------------------------------------------------
# 6. Insert the diagram rendering into the JSX
#    Find the line: <div className="mk-formula-text" style={hand}>{f.formula}</div>
#    and insert the diagram right before it.
# ------------------------------------------------------------
$diagramRender = @'
{f.diagram && <div className="mk-diagram" dangerouslySetInnerHTML={{ __html: f.diagram }} />}
'@
$patternRender = "(?s)(\s*)(<div className=""mk-formula-text"" style={hand}>{f.formula}</div>)"
$replacementRender = "`${1}$diagramRender`n`${1}`${2}"
if ($content -match $patternRender) {
    $content = $content -replace $patternRender, $replacementRender
} else {
    Write-Warning "Could not find the formula render line; please adjust the pattern manually."
}

# ------------------------------------------------------------
# 7. Add CSS for .mk-diagram inside the <style> block
# ------------------------------------------------------------
$cssRule = @'
        .mk-diagram {
          margin-bottom: 0.6rem;
          text-align: center;
        }
        .mk-diagram svg {
          max-width: 100%;
          height: auto;
        }
'@
$content = $content -replace '(?s)(</style>)', "$cssRule`n`$1"

# ------------------------------------------------------------
# 8. Write the modified content back to the file
# ------------------------------------------------------------
Set-Content $file -Value $content -Encoding UTF8 -NoNewline
Write-Host "✅ Patching complete! A timestamped backup is at: $backup"