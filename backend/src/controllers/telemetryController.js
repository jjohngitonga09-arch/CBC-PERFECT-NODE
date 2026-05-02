const { v4: uuid } = require('uuid');
const { query }    = require('../config/db');
const { getRedis } = require('../config/redis');

exports.cardEvent = async (req, res, next) => {
  try {
    const { cardId, eventType, eventData, timestamp } = req.body;
    const userId = req.user.id;
    await query(
      `INSERT INTO telemetry(id,card_id,user_id,event_type,event_data,timestamp)
       VALUES($1,$2,$3,$4,$5,$6)`,
      [uuid(), cardId, userId, eventType, JSON.stringify(eventData || {}), timestamp || new Date()]
    );
    // Invalidate student KPI cache
    await getRedis().del(`kpi:student:${userId}`);
    res.status(202).json({ ok: true });
  } catch (e) { next(e); }
};

exports.userSummary = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT event_type, COUNT(*) n FROM telemetry
       WHERE user_id=$1 GROUP BY event_type`,
      [req.params.userId]
    );
    res.json(Object.fromEntries(rows.map(r => [r.event_type, +r.n])));
  } catch (e) { next(e); }
};
