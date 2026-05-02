import os

BASE = os.path.join(os.path.expanduser("~"), "Downloads", "eduapp", "frontend", "src", "pages")

def w(rel, content):
    path = os.path.join(BASE, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  wrote  {path}")

# ─── SHARED KPI CARD COMPONENT ────────────────────────────────────────────────
w("../components/dashboard/KpiCard.jsx", """
export default function KpiCard({ icon, label, value, sub, color = "brand" }) {
  const colors = {
    brand:  "from-indigo-500 to-indigo-700",
    green:  "from-emerald-500 to-emerald-700",
    yellow: "from-amber-400 to-amber-600",
    red:    "from-rose-500 to-rose-700",
    blue:   "from-sky-500 to-sky-700",
    purple: "from-purple-500 to-purple-700",
  }
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {sub !== undefined && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{sub}</span>
        )}
      </div>
      <p className="text-3xl font-extrabold leading-none mb-1">
        {value ?? <span className="opacity-50 text-lg">—</span>}
      </p>
      <p className="text-sm text-white/75 font-medium">{label}</p>
    </div>
  )
}
""")

# ─── SHARED STAT ROW ──────────────────────────────────────────────────────────
w("../components/dashboard/StatRow.jsx", """
export default function StatRow({ label, value, max, color = "#6366f1" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value} / {max}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
""")

# ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
w("admin/Home.jsx", """
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import KpiCard from "../../components/dashboard/KpiCard"
import Spinner from "../../components/common/Spinner"

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function AdminHome() {
  const [kpis,    setKpis]    = useState(null)
  const [logs,    setLogs]    = useState([])
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get("/dashboard/admin/kpis"),
      api.get("/system/logs"),
      api.get("/admin/users"),
    ]).then(([k, l, u]) => {
      if (k.status === "fulfilled") setKpis(k.value.data)
      if (l.status === "fulfilled") setLogs(l.value.data.slice(0, 5))
      if (u.status === "fulfilled") setUsers(u.value.data.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">System overview & controls</p>
        </div>
        <Link to="/admin/shutdown"
          className="text-sm text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 font-medium">
          🔴 Shutdown
        </Link>
      </div>

      {/* KPI Grid */}
      <Section title="System KPIs">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard icon="👥" label="Total Users"          value={kpis?.totalUsers?.total}        color="brand" />
          <KpiCard icon="✅" label="Active Users"         value={kpis?.totalUsers?.active}       color="green" />
          <KpiCard icon="⏳" label="Pending Approval"     value={kpis?.totalUsers?.pending}      color="yellow" />
          <KpiCard icon="🔒" label="Locked Accounts"      value={kpis?.totalUsers?.locked}       color="red" />
          <KpiCard icon="💳" label="Active Subscriptions" value={kpis?.activeSubscriptions}      color="purple" />
          <KpiCard icon="🌐" label="Online Now"           value={kpis?.onlineUsers}              color="blue" />
        </div>
      </Section>

      {/* Revenue */}
      <Section title="Revenue">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard icon="💰" label="Total Revenue"
            value={kpis?.revenue?.total ? `KES ${Number(kpis.revenue.total).toLocaleString()}` : "—"}
            color="green" />
          <KpiCard icon="📅" label="Payments (30 days)"
            value={kpis?.revenue?.count ?? "—"}
            sub="transactions" color="brand" />
        </div>
      </Section>

      {/* Quick links */}
      <Section title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/admin/users",         icon: "👤", label: "Manage Users" },
            { to: "/admin/subscriptions", icon: "💳", label: "Subscriptions" },
            { to: "/admin/logs",          icon: "📋", label: "System Logs" },
            { to: "/admin/system-settings", icon: "⚙️", label: "Settings" },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="card text-center hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-3xl mb-2">{l.icon}</p>
              <p className="text-sm font-semibold text-gray-700">{l.label}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Recent users + logs side by side */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Section title="Recent Users">
          <div className="card divide-y divide-gray-100">
            {users.length === 0 && <p className="text-sm text-gray-400 py-3">No users found.</p>}
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.role} · {u.email || u.phone || "—"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.status === "active"    ? "bg-green-100 text-green-700" :
                  u.status === "pending"   ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"}`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recent Logs">
          <div className="card divide-y divide-gray-100">
            {logs.length === 0 && <p className="text-sm text-gray-400 py-3">No logs yet.</p>}
            {logs.map(l => (
              <div key={l.id} className="py-3">
                <p className="text-sm font-medium capitalize">{l.action?.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-400">
                  {l.type} · {new Date(l.timestamp || l.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
""")

# ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
w("teacher/Home.jsx", """
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import useAuthStore from "../../store/authStore"
import KpiCard from "../../components/dashboard/KpiCard"
import StatRow from "../../components/dashboard/StatRow"
import Spinner from "../../components/common/Spinner"

export default function TeacherHome() {
  const userId  = useAuthStore(s => s.userId)
  const name    = useAuthStore(s => s.user?.name)
  const [kpis,    setKpis]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/dashboard/teacher/kpis/${userId}`)
      .then(r => setKpis(r.data))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  const struggling = kpis?.strugglingStudents || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Welcome, {name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Here is your class at a glance</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard icon="👥" label="Students Assigned"  value={kpis?.studentsAssigned}        color="brand" />
        <KpiCard icon="📋" label="Pending Reviews"    value={kpis?.pendingSubmissions}       color="yellow" />
        <KpiCard icon="⭐" label="Average Stars"      value={kpis?.avgStars?.toFixed(2)}     color="green" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: "/teacher/create-card",    icon: "📝", label: "Create Card" },
          { to: "/teacher/upload-video",   icon: "🎬", label: "Upload Video" },
          { to: "/teacher/assignments",    icon: "📚", label: "Assignments" },
          { to: "/teacher/submissions",    icon: "✅", label: "Submissions" },
        ].map(l => (
          <Link key={l.to} to={l.to}
            className="card text-center hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2">{l.icon}</p>
            <p className="text-sm font-semibold text-gray-700">{l.label}</p>
          </Link>
        ))}
      </div>

      {/* Stars distribution */}
      <div className="card mb-6">
        <h2 className="font-bold mb-4">Submission Quality</h2>
        <StatRow label="Average Stars" value={Math.round(kpis?.avgStars ?? 0)} max={5} color="#6366f1" />
        <StatRow label="Submissions Reviewed" value={(kpis?.studentsAssigned ?? 0) - (kpis?.pendingSubmissions ?? 0)}
          max={kpis?.studentsAssigned ?? 1} color="#10b981" />
      </div>

      {/* Recent activity */}
      {kpis?.recentActivity?.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold mb-4">Recent Activity (7 days)</h2>
          <div className="divide-y divide-gray-100">
            {kpis.recentActivity.map((a, i) => (
              <div key={i} className="py-3 flex justify-between text-sm">
                <span className="capitalize">{a.action?.replace(/_/g, " ")}</span>
                <span className="text-gray-400">{new Date(a.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Struggling students */}
      {struggling.length > 0 && (
        <div className="card border-red-100">
          <h2 className="font-bold mb-3 text-red-700">⚠️ Students Needing Help</h2>
          <div className="divide-y divide-gray-100">
            {struggling.map(s => (
              <div key={s.student_id} className="py-3 flex justify-between text-sm">
                <span>{s.student_id?.slice(0, 12)}…</span>
                <span className="text-red-500 font-medium">
                  Avg {Number(s.avg_stars).toFixed(1)} ⭐
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
""")

# ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
w("student/Home.jsx", """
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import useAuthStore from "../../store/authStore"
import KpiCard from "../../components/dashboard/KpiCard"
import Spinner from "../../components/common/Spinner"

export default function StudentHome() {
  const userId  = useAuthStore(s => s.userId)
  const name    = useAuthStore(s => s.user?.name)
  const [kpis,        setKpis]        = useState(null)
  const [assignments, setAssignments] = useState([])
  const [videos,      setVideos]      = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get(`/dashboard/student/kpis/${userId}`),
      api.get(`/assignments/student/${userId}`),
      api.get("/videos/1"),
    ]).then(([k, a, v]) => {
      if (k.status === "fulfilled") setKpis(k.value.data)
      if (a.status === "fulfilled") setAssignments(a.value.data.slice(0, 3))
      if (v.status === "fulfilled") setVideos(v.value.data.slice(0, 3))
    }).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Spinner />

  const nextDue = assignments.find(a => a.status !== "graded" && a.due_date)

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Hello, {name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Keep learning — you are doing great!</p>
      </div>

      {/* Streak banner */}
      {kpis?.dailyStreak > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white p-4 mb-6 flex items-center gap-4">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="font-extrabold text-xl">{kpis.dailyStreak}-day streak!</p>
            <p className="text-white/80 text-sm">Come back tomorrow to keep it going.</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard icon="🔥" label="Day Streak"   value={kpis?.dailyStreak ?? 0}        color="yellow" />
        <KpiCard icon="⭐" label="Stars Earned" value={kpis?.starsEarned ?? 0}        color="green" />
        <KpiCard icon="🎬" label="Videos (7d)"  value={kpis?.videosWatched7d ?? 0}    color="blue" />
        <KpiCard icon="🏅" label="Badges"       value={kpis?.badges ?? 0}             color="purple" />
      </div>

      {/* Next assignment */}
      {nextDue && (
        <div className="card border-brand-200 bg-brand-50 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">Next Assignment Due</p>
              <p className="font-bold text-gray-900">{nextDue.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Due {new Date(nextDue.due_date).toLocaleDateString()}
              </p>
            </div>
            <Link to="/student/assignments" className="btn-primary text-sm">Start →</Link>
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { to: "/student/videos",      icon: "🎬", label: "Watch Videos" },
          { to: "/student/assignments", icon: "📚", label: "Assignments" },
          { to: "/student/quizzes",     icon: "📝", label: "Quizzes" },
          { to: "/student/practice/",   icon: "🎯", label: "Practice" },
          { to: "/student/badges",      icon: "🏅", label: "Badges" },
          { to: "/student/progress",    icon: "📈", label: "My Progress" },
        ].map(l => (
          <Link key={l.to} to={l.to}
            className="card text-center hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2">{l.icon}</p>
            <p className="text-sm font-semibold text-gray-700">{l.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent videos */}
      {videos.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Latest Videos</h2>
            <Link to="/student/videos" className="text-sm text-brand-600 hover:underline">See all →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {videos.map(v => (
              <div key={v.id} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                {v.thumbnail_url
                  ? <img src={v.thumbnail_url} alt={v.title}
                      className="w-full h-28 object-cover" />
                  : <div className="w-full h-28 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <span className="text-4xl">🎬</span>
                    </div>
                }
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                  <p className="text-xs text-gray-400">{v.subject} · Grade {v.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
""")

# ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
w("parent/Home.jsx", """
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../../services/api"
import useAuthStore from "../../store/authStore"
import KpiCard from "../../components/dashboard/KpiCard"
import StatRow from "../../components/dashboard/StatRow"
import Spinner from "../../components/common/Spinner"

export default function ParentHome() {
  const { studentId }    = useParams()
  const userId           = useAuthStore(s => s.userId)
  const linkedStudentIds = useAuthStore(s => s.linkedStudentIds)
  const name             = useAuthStore(s => s.user?.name)

  const target = studentId || linkedStudentIds?.[0] || userId

  const [kpis,    setKpis]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/dashboard/parent/kpis/${target}`)
      .then(r => setKpis(r.data))
      .finally(() => setLoading(false))
  }, [target])

  if (loading) return <Spinner />

  const subStatus = kpis?.subscriptionStatus?.status
  const subExpiry = kpis?.subscriptionStatus?.expiry_date

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Parent Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitoring your child's learning</p>
      </div>

      {/* Subscription alert */}
      {subStatus !== "active" && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-800">No active subscription</p>
            <p className="text-sm text-amber-700">Subscribe to unlock all content for your child.</p>
          </div>
          <Link to="/parent/subscription" className="btn-primary text-sm whitespace-nowrap">Subscribe →</Link>
        </div>
      )}

      {subStatus === "active" && subExpiry && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Subscription active</p>
            <p className="text-sm text-green-700">
              Renews {new Date(subExpiry).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon="📈" label="Progress"       value={`${kpis?.childProgress ?? 0}%`}     color="brand" />
        <KpiCard icon="💬" label="Unread Msgs"    value={kpis?.unreadMessages ?? 0}           color="yellow" />
        <KpiCard icon="🔥" label="Learning Streak" value={`${kpis?.learningStreak ?? 0}d`}   color="green" />
        <KpiCard icon="🎬" label="Videos (7d)"    value={kpis?.engagement?.videosWatched ?? 0} color="blue" />
      </div>

      {/* Progress bar */}
      <div className="card mb-6">
        <h2 className="font-bold mb-4">Assignment Completion</h2>
        <StatRow label="Completed" value={kpis?.childProgress ?? 0} max={100} color="#6366f1" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { to: `/parent/child/${target}/progress`,     icon: "📈", label: "Progress" },
          { to: `/parent/child/${target}/messages`,     icon: "💬", label: "Messages" },
          { to: "/parent/subscription",                  icon: "💳", label: "Subscription" },
          { to: "/parent/notifications",                 icon: "🔔", label: "Notifications" },
        ].map(l => (
          <Link key={l.to} to={l.to}
            className="card text-center hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2">{l.icon}</p>
            <p className="text-sm font-semibold text-gray-700">{l.label}</p>
          </Link>
        ))}
      </div>

      {/* Multiple children switcher */}
      {linkedStudentIds?.length > 1 && (
        <div className="card">
          <h2 className="font-bold mb-3">Switch Child</h2>
          <div className="flex gap-2 flex-wrap">
            {linkedStudentIds.map(id => (
              <Link key={id} to={`/parent/child/${id}/home`}
                className={`px-3 py-1.5 rounded-full text-sm border font-medium transition
                  ${id === target
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}>
                {id.slice(0, 8)}…
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
""")

print()
print("=" * 60)
print("  All dashboards written!")
print("  Admin  -> /admin/home")
print("  Teacher -> /teacher/home")
print("  Student -> /student/home")
print("  Parent  -> /parent/child/:studentId/home")
print("=" * 60)
