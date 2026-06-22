import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { connectSocket, disconnectSocket } from '../../services/socketService';
import api from '../../services/api';

const SUBSCRIPTION_FREE = [
 '/student/subscription',
 '/student/profile',
 '/student/settings',
 '/student/notifications',
];

export default function PrivateRoute() {
 const token = useAuthStore(s => s.token);
 const role = useAuthStore(s => s.role);
 const impersonating = useAuthStore(s => s.impersonating);
 const maintenanceReason = useAuthStore(s => s.maintenanceReason);
 const subscriptionStatus = useAuthStore(s => s.subscriptionStatus);
 const logout = useAuthStore(s => s.logout);
 const setMaintenance = useAuthStore(s => s.setMaintenance);
 const setSubscriptionStatus = useAuthStore(s => s.setSubscriptionStatus);
 const setSubscriptionInfo = useAuthStore(s => s.setSubscriptionInfo);
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 if (!token || role !== 'student') return;
 api.get('/subscriptions/me')
 .then(r => { setSubscriptionStatus(r.data?.status || 'inactive'); setSubscriptionInfo(r.data || null); })
 .catch(() => { setSubscriptionStatus('inactive'); setSubscriptionInfo(null); });
 }, [token, role]);

 useEffect(() => {
 if (!token) return;
 const socket = connectSocket(token);

 socket.on('force:logout', ({ reason } = {}) => {
 if (reason === 'dashboard_locked') {
 setMaintenance(reason);
 } else {
 setMaintenance(reason || 'locked');
 logout();
 disconnectSocket();
 }
 });

 socket.on('subscription:locked', () => {
 setSubscriptionStatus('locked');
 navigate('/student/subscription', { replace: true });
 });

 socket.on('subscription:unlocked', () => { setSubscriptionStatus('active'); navigate('/student/home', { replace: true }); });

 socket.on('account_locked', () => { setMaintenance('locked'); logout(); disconnectSocket(); });
 socket.on('account_suspended', () => { setMaintenance('suspended'); logout(); disconnectSocket(); });
 socket.on('account_deleted', () => { logout(); disconnectSocket(); navigate('/login', { replace: true }); });

 return () => {
 socket.off('force:logout');
 socket.off('subscription:locked');
 socket.off('subscription:unlocked');
 socket.off('account_locked');
 socket.off('account_suspended');
 socket.off('account_deleted');
 };
 }, [token]);

 if (maintenanceReason)
 return <Navigate to={`/maintenance?reason=${encodeURIComponent(maintenanceReason)}`} replace />;

 if (!token) return <Navigate to="/login" replace />;

 // Role-vs-path guard: a role can only browse its own section,
 // unless they're a guardian actively impersonating a child (role becomes 'student' then).
 const HOME = { student: '/student/home', teacher: '/teacher/home', guardian: '/parent/home', admin: '/admin/home' };
 const ALLOWED_PREFIX = {
   student: ['/student'],
   guardian: ['/parent', '/guardian'],
   teacher: ['/teacher'],
   admin: ['/admin'],
 };
 const allowed = ALLOWED_PREFIX[role] || [];
 const pathOk = allowed.some(p => location.pathname.startsWith(p)) || location.pathname.startsWith('/profile');
 if (!pathOk && HOME[role]) {
   return <Navigate to={HOME[role]} replace />;
 }

 if (role === 'student') {
 const allowed = SUBSCRIPTION_FREE.some(p => location.pathname.startsWith(p));
 if (subscriptionStatus === null && !allowed) {
 return <div style={{ padding:'60px 20px', textAlign:'center', color:'var(--sub)' }}>Loading...</div>;
 }
 if (subscriptionStatus !== 'active' && !allowed) {
 return <Navigate to="/student/subscription" replace />;
 }
 }

 return <Outlet />;
}