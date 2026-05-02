const router = require('express').Router();
const { authenticate } = require('../middleware/authenticate');
const { query } = require('../config/db');
const C = require('../controllers/notificationsController');

// GET all notifications for a user
router.get('/unread-count/:userId', authenticate, async (req,res,next) => {
  try {
    const {rows} = await query('SELECT COUNT(*)::int as count FROM notifications WHERE user_id=$1 AND read=false',[req.params.userId]);
    res.json({count: rows[0].count});
  } catch(e){next(e);}
});

router.get('/:userId', authenticate, async (req,res,next) => {
  try {
    const uid = String(req.params.userId);
    const { rows } = await query(
      `SELECT * FROM notifications
        WHERE user_id=$1
          AND NOT ($2 = ANY(COALESCE(dismissed_by,'{}')))
        ORDER BY created_at DESC LIMIT 50`,
      [uid, uid]
    ).catch(() => ({ rows: [] }));
    res.json(rows);
  } catch(e){ res.json([]); }
});
router.patch('/:id/pin', authenticate, async (req,res,next) => {
  try {
    const {rows} = await query('SELECT * FROM notifications WHERE id=$1',[req.params.id]);
    if(!rows[0]) return res.status(404).json({error:'Not found'});
    const notif = rows[0];
    if(req.user.role!=='admin' && String(notif.sender_id)!==String(req.user.id))
      return res.status(403).json({error:'Not authorized'});
    if(notif.broadcast_id){
      await query('UPDATE notifications SET pinned=NOT pinned WHERE broadcast_id=$1',[notif.broadcast_id]);
    } else {
      await query('UPDATE notifications SET pinned=NOT pinned WHERE id=$1',[req.params.id]);
    }
    const {rows:up} = await query('SELECT * FROM notifications WHERE id=$1',[req.params.id]);
    res.json(up[0]);
  } catch(e){next(e);}
});

router.patch('/:id/dismiss', authenticate, async (req,res,next) => {
  try {
    const uid = String(req.user.id);
    const { rows } = await query('SELECT id FROM notifications WHERE id=$1',[req.params.id]);
    if (!rows[0]) return res.status(404).json({ error:'Not found' });
    await query(
      `UPDATE notifications
          SET dismissed_by = array_append(COALESCE(dismissed_by,'{}'), $1::text)
        WHERE id=$2
          AND NOT ($1 = ANY(COALESCE(dismissed_by,'{}')))`,
      [uid, req.params.id]
    );
    res.json({ dismissed: true });
  } catch(e){ next(e); }
});

router.patch('/:id', authenticate, C.markRead);

// POST / — broadcast compose
router.post('/', authenticate, async (req,res,next) => {
  try {
    const { title, message, type='system', targetRole='all', targetUserId } = req.body;
    if(!title||!message) return res.status(400).json({error:'Title and message required'});
    const bid = require('crypto').randomUUID();
    let sql='SELECT id FROM users WHERE 1=1', params=[];
    if(targetUserId){ sql+=' AND id=$1'; params=[targetUserId]; }
    else if(targetRole!=='all'){ sql+=' AND role=$1'; params=[targetRole]; }
    const {rows:users} = await query(sql,params);
    await Promise.all(users.map(u=>query(
      `INSERT INTO notifications(user_id,sender_id,title,message,type,target_roles,broadcast_id,read,pinned,reactions) VALUES($1,$2,$3,$4,$5,$6,$7,false,false,'{}')`,
      [u.id, String(req.user.id), title, message, type, targetRole, bid]
    )));
    res.json({sent:users.length, broadcast_id:bid});
  } catch(e){next(e);}
});

// POST /:id/react — toggle emoji
router.post('/:id/react', authenticate, async (req,res,next) => {
  try {
    const {emoji} = req.body;
    if(!emoji) return res.status(400).json({error:'Emoji required'});
    const {rows} = await query('SELECT reactions FROM notifications WHERE id=$1',[req.params.id]);
    if(!rows[0]) return res.status(404).json({error:'Not found'});
    const reactions = rows[0].reactions || {};
    const uid = String(req.user.id);
    if(!reactions[emoji]) reactions[emoji]=[];
    const idx = reactions[emoji].indexOf(uid);
    if(idx>-1){ reactions[emoji].splice(idx,1); if(!reactions[emoji].length) delete reactions[emoji]; }
    else reactions[emoji].push(uid);
    const {rows:up} = await query('UPDATE notifications SET reactions=$1 WHERE id=$2 RETURNING reactions',[JSON.stringify(reactions),req.params.id]);
    res.json({reactions:up[0].reactions});
  } catch(e){next(e);}
});

// DELETE /:id — permanent delete
router.delete('/:id', authenticate, async (req,res,next) => {
  try {
    const {rows} = await query('SELECT * FROM notifications WHERE id=$1',[req.params.id]);
    if(!rows[0]) return res.status(404).json({error:'Not found'});
    const notif = rows[0];
    if(req.user.role==='admin'){
      await query('DELETE FROM notifications WHERE id=$1',[req.params.id]);
    } else if(String(notif.sender_id)===String(req.user.id)){
      if(notif.broadcast_id) await query('DELETE FROM notifications WHERE broadcast_id=$1',[notif.broadcast_id]);
      else await query('DELETE FROM notifications WHERE id=$1',[req.params.id]);
    } else {
      return res.status(403).json({error:'Not authorized'});
    }
    res.json({deleted:true});
  } catch(e){next(e);}
});

module.exports = router;
