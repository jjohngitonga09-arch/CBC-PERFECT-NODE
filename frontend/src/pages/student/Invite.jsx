import InviteCard from '../../components/student/InviteCard'
import { useNavigate } from 'react-router-dom'

export default function InvitePage() {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px' }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'transparent', border: 'none', color: 'var(--sub)',
        cursor: 'pointer', fontSize: '.85rem', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
      }}>
        ← Back
      </button>
      <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text)', margin: '0 0 6px' }}>
        Invite Friends
      </h1>
      <p style={{ color: 'var(--sub)', margin: '0 0 24px', fontSize: '.9rem' }}>
        Share EduApp with friends and earn free days together.
      </p>
      <InviteCard />
    </div>
  )
}
