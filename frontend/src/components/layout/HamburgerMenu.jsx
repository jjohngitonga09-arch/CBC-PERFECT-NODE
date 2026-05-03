import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import useNotifCount from '../../hooks/useNotifCount'
import Avatar from '../common/Avatar'

const MENUS = {
  student: [
    {
      group: 'LEARN',
      items: [
        { icon: '🏠', label: 'Home',           path: '/student/home' },
        { icon: '⭐', label: 'Junior Basics',  path: '/student/junior-basics' },
        { icon: '📖', label: 'Lower Grade',    path: '/student/study-time' },
        { icon: '📓', label: 'My Notes',       path: '/student/notes' },
        { icon: '📚', label: 'Stories',        path: '/student/stories' },
        { icon: '✝️',  label: 'Bible Stories',  path: '/student/bible-stories' },
        { icon: '✏️',  label: 'Writing',        path: '/student/writing' },
        { icon: '➗', label: 'Math Knowledge', path: '/student/math-knowledge' },
        { icon: '🌍', label: 'World Explorer', path: '/student/world-explorer' },
      ],
    },
    {
      group: 'ACTIVITY',
      items: [
        { icon: '🎬', label: 'Videos',         path: '/student/videos' },
        { icon: '📝', label: 'Assignments',    path: '/student/assignments' },
        { icon: '🧩', label: 'Quizzes',        path: '/student/quizzes' },
        { icon: '🏅', label: 'Badges',         path: '/student/badges' },
        { icon: '📊', label: 'My Progress',    path: '/student/progress' },
        { icon: '🏆', label: 'Leaderboard',    path: '/student/leaderboard' },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { icon: '💬', label: 'Messages',       path: '/student/messages' },
        { icon: '🔔', label: 'Notifications',  path: '/student/notifications', notif: true },
        { icon: '💳', label: 'Subscription',   path: '/student/subscription', subAlert: true },
        { icon: '⚙️',  label: 'Settings',       path: '/student/settings' },
        { icon: '👤', label: 'Profile',        path: '/student/profile' },
      ],
    },
  ],
  guardian: [
    {
      group: 'OVERVIEW',
      items: [
        { icon: '🏠', label: 'Home',           path: '/parent/home' },
        { icon: '👨‍👩‍👧', label: 'My Children',   path: '/guardian/children' },
        { icon: '📊', label: 'Progress',       path: '/parent/child/me/progress' },
        { icon: '💳', label: 'Subscription',   path: '/parent/subscription' },
        { icon: '🧾', label: 'Payment History',path: '/guardian/payment-history' },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { icon: '💬', label: 'Messages',       path: '/parent/messages' },
        { icon: '🔔', label: 'Notifications',  path: '/guardian/notifications', notif: true },
        { icon: '👤', label: 'Profile',        path: '/guardian/profile' },
      ],
    },
  ],
  teacher: [
    {
      group: 'CLASSROOM',
      items: [
        { icon: '🏠', label: 'Home',           path: '/teacher/home' },
        { icon: '🃏', label: 'Create Card',    path: '/teacher/create-card' },
        { icon: '🎬', label: 'Upload Video',   path: '/teacher/upload-video' },
        { icon: '📝', label: 'Assignments',    path: '/teacher/assignments' },
        { icon: '📬', label: 'Submissions',    path: '/teacher/submissions' },
        { icon: '👩‍🎓', label: 'Students',      path: '/teacher/students' },
        { icon: '📈', label: 'Class Progress', path: '/teacher/class-progress' },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { icon: '💬', label: 'Messages',       path: '/teacher/messages' },
        { icon: '🔔', label: 'Notifications',  path: '/teacher/notifications', notif: true },
        { icon: '👤', label: 'Profile',        path: '/teacher/profile' },
      ],
    },
  ],
  admin: [
    {
      group: 'MANAGEMENT',
      items: [
        { icon: '📊', label: 'Dashboard',      path: '/admin/home' },
        { icon: '👥', label: 'Users',          path: '/admin/users' },
        { icon: '💳', label: 'Subscriptions',  path: '/admin/subscriptions' },
        { icon: '💰', label: 'Payments',       path: '/admin/payments' },
        { icon: '🔒', label: 'Locked Accounts',path: '/admin/locked' },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { icon: '📋', label: 'System Logs',    path: '/admin/logs' },
        { icon: '⚙️',  label: 'Settings',       path: '/admin/system-settings' },
        { icon: '💬', label: 'Messages',       path: '/admin/messages' },
        { icon: '🔔', label: 'Notifications',  path: '/admin/notifications', notif: true },
        { icon: '👤', label: 'Profile',        path: '/admin/profile' },
        { icon: '🔴', label: 'Shutdown',       path: '/admin/shutdown', danger: true },
      ],
    },
  ],
}

export default function HamburgerMenu({ open, onClose, onLogout }) {
  const { i18n } = useTranslation()
  const role = useAuthStore(s => s.role)
  const user = useAuthStore(s => s.user)
  const subscriptionStatus = useAuthStore(s => s.subscriptionStatus)
  const loc = useLocation()
  const groups = MENUS[role] || []
  const [notifCount] = useNotifCount()

  return (
    <>
      <style>{`
        .side-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          margin-bottom: 2px;
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.15s;
          cursor: pointer;
          font-size: .875rem;
          font-weight: 500;
          color: var(--sub);
          position: relative;
        }
        .side-link:hover {
          background: rgba(255,255,255,0.04);
          color: #e5e7eb;
        }
        .side-link.active {
          background: rgba(99,102,241,0.14);
          border-color: rgba(99,102,241,0.28);
          color: #a5b4fc;
          font-weight: 700;
        }
        .side-link.danger { color: #f87171; }
        .side-link.danger:hover { background: rgba(239,68,68,0.08); }
        .group-label {
          font-size: .62rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: var(--surface-hover);
          padding: 6px 12px 4px;
          margin-top: 6px;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 49,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0,
        height: '100%', width: '268px',
        background: 'var(--bg)',
        borderRight: '1px solid var(--surface)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? '20px 0 60px rgba(0,0,0,0.5)' : 'none',
      }}>

        {/* ── Header: User info ── */}
        <div style={{
          padding: '16px 14px',
          borderBottom: '1px solid var(--surface)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.06))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginRight: '5px' }} />
              <span style={{ fontSize: '.68rem', color: 'var(--sub)', fontWeight: 600 }}>ONLINE</span>
            </div>
            {/* Close X button */}
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--sub)', fontSize: '1rem', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar user={user} size={46} clickable={false} />
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: 'var(--text)', fontWeight: 800, fontSize: '.95rem', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ color: 'var(--sub)', fontSize: '.72rem', margin: 0, textTransform: 'capitalize' }}>
                {role === 'guardian' ? 'Parent' : role}
                {user?.grade ? ` · Grade ${user.grade}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 0' }}>
          {groups.map((group) => (
            <div key={group.group}>
              <p className="group-label">{group.group}</p>
              {group.items.map(({ icon, label, path, notif, subAlert, danger }) => {
                const isActive = loc.pathname === path || (path !== '/' && loc.pathname.startsWith(path + '/'))
                const showSubAlert = subAlert && subscriptionStatus && subscriptionStatus !== 'active'
                const showNotif = notif && notifCount > 0
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`side-link${isActive ? ' active' : ''}${danger ? ' danger' : ''}`}
                  >
                    {/* Active bar */}
                    {isActive && (
                      <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: '0 3px 3px 0', background: '#6366f1' }} />
                    )}

                    <span style={{ fontSize: '1rem', width: '22px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ flex: 1 }}>{label}</span>

                    {/* Badges */}
                    {showSubAlert && (
                      <span style={{ background: '#ef4444', color: '#fff', borderRadius: '20px', fontSize: '.6rem', fontWeight: 800, padding: '2px 6px' }}>!</span>
                    )}
                    {showNotif && (
                      <span style={{ background: '#ef4444', color: '#fff', borderRadius: '20px', fontSize: '.6rem', fontWeight: 800, padding: '2px 6px', minWidth: '18px', textAlign: 'center' }}>
                        {notifCount > 99 ? '99+' : notifCount}
                      </span>
                    )}
                    {isActive && !showNotif && !showSubAlert && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div style={{ padding: '10px 8px 16px', borderTop: '1px solid var(--surface)' }}>

          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'sw' : 'en')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', marginBottom: '6px', background: 'transparent', border: '1px solid var(--surface)', cursor: 'pointer', color: 'var(--sub)', fontSize: '.8rem', textAlign: 'left', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '1rem' }}>🌐</span>
            <span>{i18n.language === 'en' ? '🇬🇧 English' : '🇰🇪 Kiswahili'}</span>
            <span style={{ marginLeft: 'auto', fontSize: '.7rem', color: 'var(--sub)' }}>tap to switch</span>
          </button>

          {/* Sign out */}
          <button
            onClick={onLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', color: '#f87171', fontSize: '.875rem', fontWeight: 700, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
          >
            <span style={{ fontSize: '1rem' }}>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
