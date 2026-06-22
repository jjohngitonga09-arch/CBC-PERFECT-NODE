const router = require('express').Router()
const { authenticate }   = require('../middleware/authenticate')
const { authorizeRoles } = require('../middleware/authorizeRoles')
const C = require('../controllers/subscriptionsController')
// Plans
router.get('/plans',                        C.getPlans)
router.patch('/plans/:id', authenticate, authorizeRoles('admin'), C.updatePlan)
// Subscriptions
router.get('/all',      authenticate, authorizeRoles('admin'), C.getAllSubscriptions)
router.get('/me',       authenticate, (req,res,next)=>{ req.params.userId=req.user.id; C.getSubscription(req,res,next) })
router.get('/user/:userId', authenticate, C.getSubscription)
// Guardian: see their own payment messages
router.get('/messages/mine', authenticate, async (req,res,next) => {
  try {
    const { query } = require('../config/db');
    const { rows } = await query(
      `SELECT pm.*,
        COALESCE((SELECT json_agg(r.* ORDER BY r.created_at) FROM payment_message_replies r WHERE r.payment_message_id = pm.id), '[]') as replies
       FROM payment_messages pm WHERE pm.user_id=$1 ORDER BY pm.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { next(e); }
});
// Payment messages
router.post('/message',                   authenticate, C.sendMessage)
router.get('/messages',                   authenticate, authorizeRoles('admin'), C.getMessages)
router.patch('/messages/:id/confirm',     authenticate, authorizeRoles('admin'), C.confirmMessage)
router.patch('/messages/:id/reject',      authenticate, authorizeRoles('admin'), C.rejectMessage)
router.post('/messages/:id/reply',        authenticate, authorizeRoles('admin'), C.replyToMessage)
router.post('/messages/:id/reply-mine',   authenticate, C.replyAsUser)
// Lock / unlock by userId
router.patch('/lock/:userId',   authenticate, authorizeRoles('admin'), C.lockUser)
router.patch('/unlock/:userId', authenticate, authorizeRoles('admin'), C.unlockUser)
// Legacy
router.get('/:userId',  authenticate, C.getSubscription)
router.post('/', authenticate, async (req,res,next)=>{
  try {
    const { query } = require('../config/db')
    const { v4:uuid } = require('uuid')
    const { planId, userId } = req.body
    await query(
      `INSERT INTO subscriptions(id,user_id,plan_id,status,start_date,expiry_date,last_payment_date)
       VALUES(gen_random_uuid(),$1,$2,'pending',NOW(),NOW()+INTERVAL'30 days',NOW())
       ON CONFLICT(user_id) DO UPDATE SET plan_id=$2,status='pending',last_payment_date=NOW()`,
      [userId||req.user.id, planId]
    )
    res.status(201).json({ message:'Subscription pending payment.' })
  } catch(e){ next(e) }
})
router.patch('/:id/lock', authenticate, authorizeRoles('admin'), C.lockSubscription)
module.exports = router