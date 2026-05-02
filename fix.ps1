# 1 — authStore
$content = [System.IO.File]::ReadAllText("C:\Users\pc\Downloads\eduapp\frontend\src\store\authStore.js")
$content = $content -replace "setUser: \(user\) => set\(\{ user \}\),", "setUser: (user) => set({ user }),`n      updateAvatar: (avatar_url) => set(s => ({ user: s.user ? { ...s.user, avatar_url } : s.user })),"
[System.IO.File]::WriteAllText("C:\Users\pc\Downloads\eduapp\frontend\src\store\authStore.js", $content)
Write-Host "authStore done" -ForegroundColor Green

# 2 — Fix Home.jsx nav icons using simple replacements
$h = [System.IO.File]::ReadAllText("C:\Users\pc\Downloads\eduapp\frontend\src\pages\student\Home.jsx")
$h = $h -replace "icon:''", "icon:'x'"  # temp placeholder
$replacements = @{
  "to:'/student/videos', icon:'x'"       = "to:'/student/videos', icon:'V'"
  "to:'/student/assignments', icon:'x'"  = "to:'/student/assignments', icon:'A'"
  "to:'/student/quizzes', icon:'x'"      = "to:'/student/quizzes', icon:'Q'"
  "to:'/student/badges', icon:'x'"       = "to:'/student/badges', icon:'B'"
  "to:'/student/progress', icon:'x'"     = "to:'/student/progress', icon:'P'"
  "to:'/student/study-time', icon:'x'"   = "to:'/student/study-time', icon:'S'"
  "to:'/student/leaderboard', icon:'x'"  = "to:'/student/leaderboard', icon:'L'"
  "to:'/student/stories', icon:'x'"      = "to:'/student/stories', icon:'R'"
  "to:'/student/bible-stories', icon:'x'"= "to:'/student/bible-stories', icon:'C'"
  "to:'/student/writing', icon:'x'"      = "to:'/student/writing', icon:'W'"
  "to:'/student/math-knowledge', icon:'x'"= "to:'/student/math-knowledge', icon:'M'"
  "to:'/student/world-explorer', icon:'x'"= "to:'/student/world-explorer', icon:'E'"
  "to:'/student/messages', icon:'x'"     = "to:'/student/messages', icon:'G'"
}
foreach ($k in $replacements.Keys) { $h = $h.Replace($k, $replacements[$k]) }
# Fix leaderboard data field
$h = $h -replace "api\.get\('/leaderboard\?limit=200'\)", "api.get('/leaderboard')"
$h = $h -replace "s\.user_id===userId\|\|s\.id===userId", "s.student_id===userId"
[System.IO.File]::WriteAllText("C:\Users\pc\Downloads\eduapp\frontend\src\pages\student\Home.jsx", $h)
Write-Host "Home.jsx nav icons fixed" -ForegroundColor Green

# 3 — Show layout files
Write-Host "`nLayout/common components:" -ForegroundColor Cyan
Get-ChildItem "C:\Users\pc\Downloads\eduapp\frontend\src\components\layout" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  layout/$($_.Name)" }
Get-ChildItem "C:\Users\pc\Downloads\eduapp\frontend\src\components\common" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  common/$($_.Name)" }
