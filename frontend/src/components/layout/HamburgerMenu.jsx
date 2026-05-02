import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import useNotifCount from '../../hooks/useNotifCount'

const MENUS = {
 student: [
 {i:'',l:'Home', t:'/student/home'},
 {i:'',l:'Lower Grade', t:'/student/study-time'},
 {i:'',l:'Stories', t:'/student/stories'},
 {i:'',l:'Bible Stories', t:'/student/bible-stories'},
 {i:'',l:'Writing', t:'/student/writing'},
 {i:'',l:'Math Knowledge', t:'/student/math-knowledge'},
 {i:'',l:'World Explorer', t:'/student/world-explorer'},
 {i:'',l:'Videos', t:'/student/videos'},
 {i:'',l:'Assignments', t:'/student/assignments'},
 {i:'',l:'Quizzes', t:'/student/quizzes'},
 {i:'',l:'Badges', t:'/student/badges'},
 {i:'',l:'My Progress', t:'/student/progress'},
 {i:'',l:'Leaderboard', t:'/student/leaderboard'},
 {i:'',l:'Messages', t:'/student/messages'},
 {i:'',l:'Notifications', t:'/student/notifications'},
 {i:'',l:'Subscription', t:'/student/subscription'},
 {i:'',l:'Settings', t:'/student/settings'},
 {i:'',l:'Profile', t:'/student/profile'},
 ],
 guardian: [
 {i:'',l:'Home', t:'/parent/home'},
 {i:'',l:'My Children', t:'/guardian/children'},
 {i:'',l:'Progress', t:'/parent/child/me/progress'},
 {i:'',l:'Messages', t:'/parent/messages'},
 {i:'',l:'Notifications', t:'/guardian/notifications'},
 {i:'',l:'Subscription', t:'/parent/subscription'},
 {i:'',l:'Payment History', t:'/guardian/payment-history'},
 {i:'',l:'Profile', t:'/guardian/profile'},
 ],
 teacher: [
 {i:'',l:'Home', t:'/teacher/home'},
 {i:'',l:'Create Card', t:'/teacher/create-card'},
 {i:'',l:'Upload Video', t:'/teacher/upload-video'},
 {i:'',l:'Assignments', t:'/teacher/assignments'},
 {i:'',l:'Submissions', t:'/teacher/submissions'},
 {i:'',l:'Students', t:'/teacher/students'},
 {i:'',l:'Class Progress', t:'/teacher/class-progress'},
 {i:'',l:'Messages', t:'/teacher/messages'},
 {i:'',l:'Notifications', t:'/teacher/notifications'},
 {i:'',l:'Profile', t:'/teacher/profile'},
 ],
 admin: [
 {i:'',l:'Dashboard', t:'/admin/home'},
 {i:'',l:'Users', t:'/admin/users'},
 {i:'',l:'Subscriptions', t:'/admin/subscriptions'},
 {i:'',l:'Payments', t:'/admin/payments'},
 {i:'',l:'System Logs', t:'/admin/logs'},
 {i:'',l:'Settings', t:'/admin/system-settings'},
 {i:'',l:'Shutdown', t:'/admin/shutdown'},
 {i:'',l:'Messages', t:'/admin/messages'},
 {i:'',l:'Locked Accounts', t:'/admin/locked'},
 {i:'',l:'Notifications', t:'/admin/notifications'},
 {i:'',l:'Profile', t:'/admin/profile'},
 ],
}

export default function HamburgerMenu({open, onClose, onLogout}) {
 const {i18n} = useTranslation()
 const role = useAuthStore(s=>s.role)
 const user = useAuthStore(s=>s.user)
 const loc = useLocation()
 const links = MENUS[role] || []
 const initial = user?.name?.[0]?.toUpperCase() || '?'
 const [notifCount] = useNotifCount()
 const subscriptionStatus = useAuthStore(s => s.subscriptionStatus)

 return (
 <>
 <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:49,opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity 0.28s ease',backdropFilter:'blur(3px)'}}/>
 <aside style={{position:'fixed',left:0,top:0,height:'100%',width:'272px',background:'#111827',borderRight:'1px solid #1f2937',zIndex:50,display:'flex',flexDirection:'column',transform:open?'translateX(0)':'translateX(-100%)',transition:'transform 0.3s cubic-bezier(0.4,0,0.2,1)',boxShadow:open?'12px 0 40px rgba(0,0,0,0.6)':'none'}}>

 {/* User header */}
 <div style={{padding:'18px 16px 14px',borderBottom:'1px solid #1f2937',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
 <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
 <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'1rem',flexShrink:0}}>
 {initial}
 </div>
 <div>
 <p style={{color:'#f9fafb',fontWeight:700,fontSize:'.875rem',margin:0}}>{user?.name||'User'}</p>
 <p style={{color:'#6b7280',fontSize:'.72rem',margin:0,textTransform:'capitalize'}}>{role==='guardian'?'Parent':role}</p>
 </div>
 </div>
 <button onClick={onClose} style={{background:'rgba(255,255,255,0.05)',border:'1px solid #374151',borderRadius:'8px',width:'30px',height:'30px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#9ca3af',flexShrink:0,fontSize:'.9rem'}}></button>
 </div>

 {/* Nav links */}
 <nav style={{flex:1,overflowY:'auto',padding:'10px'}}>
 {links.map(({i,l,t}) => {
 const on = loc.pathname===t || (t!=='/' && loc.pathname.startsWith(t+'/'))
 const isNotif = t.endsWith('/notifications')
 return (
 <Link key={t} to={t} onClick={onClose}
 style={{display:'flex',alignItems:'center',gap:'11px',padding:'10px 12px',borderRadius:'10px',marginBottom:'3px',textDecoration:'none',background:on?'rgba(99,102,241,0.15)':'transparent',border:on?'1px solid rgba(99,102,241,0.25)':'1px solid transparent',color:on?'#a5b4fc':'#9ca3af',fontWeight:on?600:400,fontSize:'.875rem',transition:'all 0.15s'}}>
 <span style={{fontSize:'1rem',width:'20px',textAlign:'center',flexShrink:0}}>{i}</span>
 <span style={{flex:1}}>{l}</span>
 {role === 'student' && l === 'Subscription' && subscriptionStatus && subscriptionStatus !== 'active' && (<span style={{background:'#ef4444',color:'#fff',borderRadius:'20px',fontSize:'.6rem',fontWeight:800,padding:'1px 6px'}}>!</span>)}
 {isNotif && notifCount > 0 && (
 <span style={{background:'#ef4444',color:'#fff',borderRadius:'20px',fontSize:'.6rem',fontWeight:800,padding:'1px 6px',minWidth:'18px',textAlign:'center',lineHeight:'16px'}}>
 {notifCount > 99 ? '99+' : notifCount}
 </span>
 )}
 {on && <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#6366f1',flexShrink:0}}/>}
 </Link>
 )
 })}
 </nav>

 {/* Footer */}
 <div style={{padding:'10px',borderTop:'1px solid #1f2937'}}>
 <button onClick={()=>i18n.changeLanguage(i18n.language==='en'?'sw':'en')} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'10px',marginBottom:'6px',background:'transparent',border:'1px solid #1f2937',cursor:'pointer',color:'#9ca3af',fontSize:'.875rem',textAlign:'left'}}>
 <span></span><span>Language: {i18n.language==='en'?'English':'Kiswahili'}</span>
 </button>
 <button onClick={onLogout} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'10px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.18)',cursor:'pointer',color:'#fca5a5',fontSize:'.875rem',fontWeight:600}}>
 <span></span><span>Sign out</span>
 </button>
 </div>
 </aside>
 </>
 )
}




