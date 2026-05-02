$m = [System.IO.File]::ReadAllText("C:\Users\pc\Downloads\eduapp\frontend\src\pages\shared\Messages.jsx")

# Ensure Avatar is imported
if ($m -notmatch "import Avatar from") {
  $m = $m -replace "(import toast from 'react-hot-toast')", "`$1`nimport Avatar from '../../components/common/Avatar'"
}

# Remove the old MiniAvatar function entirely — we use real Avatar now
$m = [System.Text.RegularExpressions.Regex]::Replace($m, 'function MiniAvatar\(\{[^}]+\}\)\s*\{[\s\S]+?\n\}', '')

# Replace every <MiniAvatar ... /> with <Avatar user={...} clickable={true} />
# In conversation list — user object is the convo item itself
$m = $m -replace '<MiniAvatar\s+name=\{([a-zA-Z0-9_.]+)\.name\}\s*(size=\{([0-9]+)\})?\s*/>', '<Avatar user={$1} size={$3} clickable={true} />'
# In chat header — active user
$m = $m -replace '<MiniAvatar\s+name=\{active\.name\}\s*(size=\{([0-9]+)\})?\s*/>', '<Avatar user={active} size={$2} clickable={true} />'
# In message bubbles — sender
$m = $m -replace '<MiniAvatar\s+name=\{([a-zA-Z0-9_.]+)\.sender_name\}\s*(size=\{([0-9]+)\})?\s*/>', '<Avatar user={{ name:$1.sender_name, avatar_url:$1.sender_avatar, role:$1.sender_role }} size={$3} clickable={true} />'
# Fix empty size
$m = $m -replace 'size=\{\}\s', 'size={36} '

[System.IO.File]::WriteAllText("C:\Users\pc\Downloads\eduapp\frontend\src\pages\shared\Messages.jsx", $m, [System.Text.Encoding]::UTF8)
Write-Host "Messages.jsx fully fixed!" -ForegroundColor Green

# Verify Avatar import landed
$check = [System.IO.File]::ReadAllText("C:\Users\pc\Downloads\eduapp\frontend\src\pages\shared\Messages.jsx")
if ($check -match "import Avatar") { Write-Host "Avatar import: OK" -ForegroundColor Green }
else { Write-Host "Avatar import: MISSING" -ForegroundColor Red }
if ($check -match "MiniAvatar") { Write-Host "WARNING: MiniAvatar still present" -ForegroundColor Yellow }
else { Write-Host "MiniAvatar: fully replaced" -ForegroundColor Green }
