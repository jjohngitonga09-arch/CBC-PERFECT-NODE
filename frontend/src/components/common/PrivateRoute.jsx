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
 const maintenanceReason = useAuthStore(s => s.maintenanceReason);
 const subscriptionStatus = useAuthStore(s => s.subscriptionStatus);
 const logout = useAuthStore(s => s.logout);
 const setMaintenance = useAuthStore(s => s.setMaintenance);
 const setSubscriptionStatus = useAuthStore(s => s.setSubscriptionStatus);
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 if (!token || role !== 'student') return;
 api.get('/subscriptions/me')
 .then(r => setSubscriptionStatus(r.data?.status || 'inactive'))
 .catch(() => setSubscriptionStatus('inactive'));
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

 if (role === 'student' && subscriptionStatus && subscriptionStatus !== 'active') {
 const allowed = SUBSCRIPTION_FREE.some(p => location.pathname.startsWith(p));
 if (!allowed) return <Navigate to="/student/subscription" replace />;
 }

 return <Outlet />;
}