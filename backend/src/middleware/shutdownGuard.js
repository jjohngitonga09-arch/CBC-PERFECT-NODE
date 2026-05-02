let _shuttingDown = false;

function shutdownGuard(req, res, next) {
  if (_shuttingDown && req.path !== '/health')
    return res.status(503).json({ error: 'Server shutting down — try again shortly' });
  next();
}

function setShuttingDown(val) { _shuttingDown = val; }
function isShuttingDown()     { return _shuttingDown; }

module.exports = { shutdownGuard, setShuttingDown, isShuttingDown };
