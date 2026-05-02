$ErrorActionPreference = 'Stop'

$BASE = "C:\Users\pc\Downloads\eduapp"
$PR   = "$BASE\frontend\src\components\common\PrivateRoute.jsx"
$AS   = "$BASE\frontend\src\store\authStore.js"
$HM   = "$BASE\frontend\src\components\layout\HamburgerMenu.jsx"
$CTRL = "$BASE\backend\src\controllers\subscriptionsController.js"

foreach ($f in @($PR, $AS, $HM, $CTRL)) {
  if (-not (Test-Path $f)) { Write-Host "NOT FOUND: $f" -ForegroundColor Red; exit 1 }
}
Write-Host 'All 4 files found.' -ForegroundColor DarkGray
Write-Host ''


# 1. PrivateRoute.jsx  -  full rewrite
Write-Host '[1/4] PrivateRoute.jsx' -ForegroundColor Cyan

$prContent = @'
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
  const token                 = useAuthStore(s => s.token);
  const role                  = useAuthStore(s => s.role);
  const maintenanceReason     = useAuthStore(s => s.maintenanceReason);
  const subscriptionStatus    = useAuthStore(s => s.subscriptionStatus);
  const logout                = useAuthStore(s => s.logout);
  const setMaintenance        = useAuthStore(s => s.setMaintenance);
  const setSubscriptionStatus = useAuthStore(s => s.setSubscriptionStatus);
  const navigate              = useNavigate();
  const location              = useLocation();

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

    socket.on('subscription:unlocked', () => setSubscriptionStatus('active'));

    socket.on('account_locked',    () => { setMaintenance('locked');    logout(); disconnectSocket(); });
    socket.on('account_suspended', () => { setMaintenance('suspended'); logout(); disconnectSocket(); });
    socket.on('account_deleted',   () => { logout(); disconnectSocket(); navigate('/login', { replace: true }); });

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
'@

[System.IO.File]::WriteAllText($PR, $prContent, [System.Text.Encoding]::UTF8)
Write-Host '  done' -ForegroundColor Green
Write-Host ''


# 2. authStore.js  -  persist subscriptionStatus
Write-Host '[2/4] authStore.js' -ForegroundColor Cyan

$as = [System.IO.File]::ReadAllText($AS)
if ($as -notmatch 'subscriptionStatus: s\.subscriptionStatus') {
  $as = $as.Replace(
    'maintenanceReason: s.maintenanceReason',
    'maintenanceReason: s.maintenanceReason, subscriptionStatus: s.subscriptionStatus'
  )
  [System.IO.File]::WriteAllText($AS, $as, [System.Text.Encoding]::UTF8)
  Write-Host '  partialize updated' -ForegroundColor Green
} else {
  Write-Host '  already includes subscriptionStatus - skipped' -ForegroundColor Yellow
}
Write-Host ''


# 3. HamburgerMenu.jsx  -  subscription warning badge
Write-Host '[3/4] HamburgerMenu.jsx' -ForegroundColor Cyan

$hm = [System.IO.File]::ReadAllText($HM)
if ($hm -notmatch 'subscriptionStatus') {

  $hm = $hm.Replace(
    'const [notifCount] = useNotifCount()',
    "const [notifCount] = useNotifCount()`n  const subscriptionStatus = useAuthStore(s => s.subscriptionStatus)"
  )

  $hm = $hm.Replace(
    '{isNotif && notifCount > 0 && (',
    "{role === 'student' && l === 'Subscription' && subscriptionStatus && subscriptionStatus !== 'active' && (<span style={{background:'#ef4444',color:'#fff',borderRadius:'20px',fontSize:'.6rem',fontWeight:800,padding:'1px 6px'}}>!</span>)}`n                {isNotif && notifCount > 0 && ("
  )

  [System.IO.File]::WriteAllText($HM, $hm, [System.Text.Encoding]::UTF8)
  Write-Host '  done' -ForegroundColor Green
} else {
  Write-Host '  already patched - skipped' -ForegroundColor Yellow
}
Write-Host ''


# 4. subscriptionsController.js  -  emit socket events
Write-Host '[4/4] subscriptionsController.js' -ForegroundColor Cyan

$ctrl = [System.IO.File]::ReadAllText($CTRL)

if ($ctrl -notmatch 'notifyUser') {
  $ctrl = $ctrl.Replace(
    "const { query } = require('../config/db')",
    "const { query } = require('../config/db')`nconst { notifyUser } = require('../websocket/socket');"
  )
}

if ($ctrl -notmatch 'subscription:locked') {
  $lines    = $ctrl -split "`r?`n"
  $out      = [System.Collections.Generic.List[string]]::new()
  $inLock   = $false; $lockDone   = $false
  $inUnlock = $false; $unlockDone = $false

  foreach ($line in $lines) {
    if ($line -match 'exports\.lockUser\s*=')   { $inLock   = $true }
    if ($line -match 'exports\.unlockUser\s*=') { $inUnlock = $true; $inLock = $false }

    if ($inLock -and -not $lockDone -and $line -match 'res\.json') {
      $out.Add("  try { notifyUser(req.params.userId, 'subscription:locked', { reason: 'payment_required' }) } catch(_) {}")
      $lockDone = $true; $inLock = $false
    }
    if ($inUnlock -and -not $unlockDone -and $line -match 'res\.json') {
      $out.Add("  try { notifyUser(req.params.userId, 'subscription:unlocked', {}) } catch(_) {}")
      $unlockDone = $true; $inUnlock = $false
    }

    $out.Add($line)
  }

  if (-not $lockDone)   { Write-Host '  WARN: lockUser res.json not found - patch manually' -ForegroundColor Red }
  if (-not $unlockDone) { Write-Host '  WARN: unlockUser res.json not found - patch manually' -ForegroundColor Red }

  $ctrl = $out -join "`n"
  [System.IO.File]::WriteAllText($CTRL, $ctrl, [System.Text.Encoding]::UTF8)
  Write-Host "  done (lockDone=$lockDone  unlockDone=$unlockDone)" -ForegroundColor Green
} else {
  Write-Host '  already patched - skipped' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'All done! Restart both dev servers.' -ForegroundColor Cyan
Write-Host 'Test: admin locks a student -> redirected to /student/subscription instantly.' -ForegroundColor Yellow
