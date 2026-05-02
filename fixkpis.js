const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, 'frontend', 'src')

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, 'utf8')
  console.log('Fixed: ' + rel)
}

// ─── 1. Fix both KpiCard components ───────────────────────────────────────────
const kpiFiles = [
  'components/common/KpiCard.jsx',
  'components/dashboard/KpiCard.jsx',
]

kpiFiles.forEach(rel => {
  let c = read(rel)

  // Replace empty defaultIcon returns with text symbols
  c = c.replace(
    /const icons = \{[^}]*\}/,
    `const icons = { blue: 'i', green: 'ok', yellow: '*', red: '!', purple: '#', brand: '%' }`
  )

  // Replace any icon prop that is empty string with nothing (let defaultIcon handle it)
  // The icon box will use the color-based default
  write(rel, c)
})

// ─── 2. Fix student Progress.jsx ──────────────────────────────────────────────
let p = read('pages/student/Progress.jsx')

// Fix the broken icon strings left from corrupted emojis
p = p.replace(/icon:'=%'/g,  "icon:'~'")   // streak
p = p.replace(/icon:'P'/g,   "icon:'*'")   // stars (only the icon field, not other P refs)
p = p.replace(/icon:''/g,    "icon:'%'")   // completion (was emoji, now empty)

// Fix 'P'.repeat() used for star display
p = p.replace(/'P'\.repeat\(\+a\.stars\|\|0\)/g, "'*'.repeat(Math.min(+a.stars||0,5))")

// Fix paragraph sign ¶ left in labels
p = p.replace(/¶/g, '--')
p = p.replace(/N\/A/g, '--')

write('pages/student/Progress.jsx', p)

// ─── 3. Fix teacher Home.jsx KpiCard icons ───────────────────────────────────
let th = read('pages/teacher/Home.jsx')
// All icon="" props on KpiCard lines - replace in order they appear
th = th.replace(/<KpiCard icon="" label="Students"/, '<KpiCard icon="S" label="Students"')
th = th.replace(/<KpiCard icon="" label="Pending Reviews"/, '<KpiCard icon="P" label="Pending Reviews"')
th = th.replace(/<KpiCard icon="" label="Avg Stars"/, '<KpiCard icon="*" label="Avg Stars"')
th = th.replace(/<KpiCard icon="" label="Recent Activity"/, '<KpiCard icon="A" label="Recent Activity"')
// Fix nav quick-link icons that are now empty
th = th.replace(/{to:'\/teacher\/create-card', icon:'', label:'Create Card'}/,   "{to:'/teacher/create-card', icon:'C', label:'Create Card'}")
th = th.replace(/{to:'\/teacher\/upload-video', icon:'', label:'Upload Video'}/,  "{to:'/teacher/upload-video', icon:'V', label:'Upload Video'}")
th = th.replace(/{to:'\/teacher\/assignments', icon:'', label:'Assignments'}/,   "{to:'/teacher/assignments', icon:'A', label:'Assignments'}")
th = th.replace(/{to:'\/teacher\/submissions', icon:'', label:'Submissions'}/,   "{to:'/teacher/submissions', icon:'S', label:'Submissions'}")
th = th.replace(/{to:'\/teacher\/class-progress', icon:'', label:'Progress'}/,   "{to:'/teacher/class-progress', icon:'%', label:'Progress'}")
th = th.replace(/{to:'\/teacher\/messages', icon:'', label:'Messages'}/,         "{to:'/teacher/messages', icon:'M', label:'Messages'}")
write('pages/teacher/Home.jsx', th)

// ─── 4. Fix parent Home.jsx KpiCard icons ────────────────────────────────────
let ph = read('pages/parent/Home.jsx')
ph = ph.replace(/<KpiCard icon="" label="Progress"/,    '<KpiCard icon="%" label="Progress"')
ph = ph.replace(/<KpiCard icon="" label="Unread Msgs"/, '<KpiCard icon="M" label="Unread Msgs"')
ph = ph.replace(/<KpiCard icon="" label="Day Streak"/,  '<KpiCard icon="~" label="Day Streak"')
// Fix insight row icons
ph = ph.replace(/icon:'', label:`\$\{d\.dailyStreak\}/,   "icon:'~', label:`${d.dailyStreak}")
ph = ph.replace(/icon:'', label:`\$\{d\.starsEarned\}/,   "icon:'*', label:`${d.starsEarned}")
ph = ph.replace(/icon:'', label:`\$\{d\.videosWatched7d\}/, "icon:'V', label:`${d.videosWatched7d}")
ph = ph.replace(/icon:'', label:`\$\{d\.badges\}/,        "icon:'#', label:`${d.badges}")
write('pages/parent/Home.jsx', ph)

// ─── 5. Fix admin Home.jsx KpiCard icons ─────────────────────────────────────
let ah = read('pages/admin/Home.jsx')
ah = ah.replace(/<KpiCard icon="" label="Total Users"/,   '<KpiCard icon="U" label="Total Users"')
ah = ah.replace(/<KpiCard icon="" label="Active"/,        '<KpiCard icon="A" label="Active"')
ah = ah.replace(/<KpiCard icon="" label="Pending"/,       '<KpiCard icon="P" label="Pending"')
ah = ah.replace(/<KpiCard icon="" label="Locked"/,        '<KpiCard icon="L" label="Locked"')
ah = ah.replace(/<KpiCard icon="" label="Subscriptions"/, '<KpiCard icon="S" label="Subscriptions"')
ah = ah.replace(/<KpiCard icon="" label="Revenue"/,       '<KpiCard icon="$" label="Revenue"')
// Fix nav icons
ah = ah.replace(/{ to:'\/admin\/users', icon:'', label:'Users' }/,             "{ to:'/admin/users', icon:'U', label:'Users' }")
ah = ah.replace(/{ to:'\/admin\/subscriptions', icon:'', label:'Subscriptions' }/, "{ to:'/admin/subscriptions', icon:'S', label:'Subscriptions' }")
ah = ah.replace(/{ to:'\/admin\/payments', icon:'', label:'Payments' }/,       "{ to:'/admin/payments', icon:'$', label:'Payments' }")
ah = ah.replace(/{ to:'\/admin\/messages', icon:'', label:'Messages' }/,       "{ to:'/admin/messages', icon:'M', label:'Messages' }")
ah = ah.replace(/{ to:'\/admin\/logs', icon:'', label:'Logs' }/,               "{ to:'/admin/logs', icon:'L', label:'Logs' }")
ah = ah.replace(/{ to:'\/admin\/system-settings', icon:'', label:'Settings' }/, "{ to:'/admin/system-settings', icon:'G', label:'Settings' }")
write('pages/admin/Home.jsx', ah)

console.log('\nAll done!')
