const { query } = require('../config/db');
const { setShuttingDown } = require('../middleware/shutdownGuard');
const logger = require('../utils/logger');

exports.triggerShutdown = async (req, res, next) => {
  try {
    logger.warn(`SHUTDOWN triggered by admin ${req.user.id}`);
    setShuttingDown(true);
    await query(
      `INSERT INTO logs(id,type,user_id,action,meta,timestamp)
       VALUES(gen_random_uuid(),'system',$1,'shutdown','{}',NOW())`,
      [req.user.id]
    );
    res.json({ message: 'Shutdown initiated. No new requests will be accepted.' });
    // Give a brief window for response to flush, then exit
    setTimeout(() => process.exit(0), 3000);
  } catch (e) { next(e); }
};

exports.getLogs = async (req, res, next) => {
  try {
    const limit  = Math.min(+req.query.limit || 200, 1000);
    const { action, role, from, to, search } = req.query;

    let where = [];
    let params = [];
    let i = 1;

    if (action)  { where.push(`l.action=$${i++}`);  params.push(action); }
    if (role)    { where.push(`l.role=$${i++}`);     params.push(role); }
    if (from)    { where.push(`l.timestamp>=$${i++}`); params.push(from); }
    if (to)      { where.push(`l.timestamp<=$${i++}`); params.push(to); }
    if (search)  { where.push(`(l.user_name ILIKE $${i++} OR l.action ILIKE $${i-1} OR l.ip ILIKE $${i-1})`); params.push('%'+search+'%'); }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    params.push(limit);

    const { rows } = await query(
      `SELECT l.*, u.email FROM logs l
       LEFT JOIN users u ON u.id=l.user_id
       ${whereClause}
       ORDER BY l.timestamp DESC LIMIT $${i}`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM system_settings');
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json(settings);
  } catch (e) { next(e); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await query(
        `INSERT INTO system_settings(key,value) VALUES($1,$2)
         ON CONFLICT(key) DO UPDATE SET value=$2`,
        [key, value]
      );
    }
    res.json({ message: 'Settings updated.' });
  } catch (e) { next(e); }
};

exports.deleteLogs = async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM logs');
    // Write one entry recording the wipe
    await query(
      `INSERT INTO logs(type,action,user_id,user_name,role,ip,meta,timestamp)
       VALUES('admin','logs_cleared',$1,$2,$3,$4,'{}',NOW())`,
      [req.user.id, req.user.name, req.user.role,
       req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || null]
    );
    res.json({ success: true, deleted: rowCount });
  } catch (e) { next(e); }
};
