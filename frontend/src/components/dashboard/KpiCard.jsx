export default function KpiCard({ label, value, sub, color = 'blue', icon }) {
 const palette = {
 blue: { icon: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)' },
 green: { icon: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)' },
 yellow: { icon: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.25)' },
 red: { icon: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.25)' },
 purple: { icon: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.25)' },
 brand: { icon: '#6366f1', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.25)' },
 }
 const c = palette[color] ?? palette.blue
 return (
 <div style={{
 background: 'var(--surface)',
 border: '1px solid var(--border)',
 borderRadius: 'var(--radius)',
 padding: '20px',
 boxShadow: 'var(--shadow)',
 display: 'flex',
 flexDirection: 'column',
 gap: 6,
 position: 'relative',
 overflow: 'hidden',
 }}>
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0,
 height: 3, background: c.icon,
 borderRadius: 'var(--radius) var(--radius) 0 0',
 }} />
 <div style={{
 width: 40, height: 40, borderRadius: 10,
 background: c.bg,
 border: `1px solid ${c.border}`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: '1.2rem', marginBottom: 4,
 }}>
 {icon ?? defaultIcon(color)}
 </div>
 <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
 {value ?? '--'}
 </p>
 <p style={{ margin: 0, fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--sub)' }}>
 {label}
 </p>
 {sub && <p style={{ margin: 0, fontSize: '.72rem', color: c.icon, fontWeight: 600 }}>{sub}</p>}
 </div>
 )
}
function defaultIcon(color) {
 const icons = { blue: '🎬', green: '⭐', yellow: '🔥', red: '❗', purple: '🏆', brand: '📈' }
 return icons[color] ?? '📊'
}
