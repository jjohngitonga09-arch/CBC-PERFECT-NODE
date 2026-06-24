import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000'

export default function InviteCard() {
  const user = useAuthStore(s => s.user)
  const refCode = user?.username || ('EDU' + (user?.id || '').slice(0,6).toUpperCase())
  const link = `${APP_URL}/signup?ref=${refCode}`

  function copy() {
    navigator.clipboard.writeText(link)
    toast.success('Invite link copied!')
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: 'Join EduApp', text: 'Join me on EduApp and start learning!', url: link })
    } else {
      copy()
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '20px',
      padding: '28px 24px',
      marginBottom: '32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '2rem' }}>🎁</div>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
            Invite a Friend, Get 7 Days Free
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '.8rem', color: 'var(--sub)' }}>
            Share your link — when they subscribe, you both get 7 extra days free
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', margin: '18px 0 20px', flexWrap: 'wrap' }}>
        {[
          { icon: '🔗', label: 'Share your link' },
          { icon: '📝', label: 'Friend signs up' },
          { icon: '💳', label: 'They subscribe' },
          { icon: '🎉', label: 'You get 7 days free' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '6px 12px', fontSize: '.78rem', color: 'var(--sub)' }}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
            {i < 3 && <span style={{ marginLeft: '4px', color: 'rgba(255,255,255,0.2)' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{
          flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '10px 14px',
          fontSize: '.78rem', color: 'var(--sub)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: 'monospace',
        }}>
          {link}
        </div>
        <button onClick={copy} style={{
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          color: '#818cf8', borderRadius: '12px', padding: '10px 16px',
          fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Copy
        </button>
        <button onClick={share} style={{
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none',
          color: '#fff', borderRadius: '12px', padding: '10px 16px',
          fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Share
        </button>
      </div>

      <p style={{ margin: '12px 0 0', fontSize: '.72rem', color: 'var(--sub)', textAlign: 'center' }}>
        Your referral code: <strong style={{ color: '#818cf8' }}>{refCode}</strong>
      </p>
    </div>
  )
}
