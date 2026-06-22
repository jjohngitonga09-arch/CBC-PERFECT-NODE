const { query } = require('../config/db')
const { notifyUser } = require('../websocket/socket');
const { v4: uuid } = require('uuid')

exports.getPlans = async (req,res,next) => {
  try {
    const { rows } = await query('SELECT * FROM subscription_plans WHERE is_active=true ORDER BY sort_order')
    res.json(rows)
  } catch(e){ next(e) }
}

exports.updatePlan = async (req,res,next) => {
  try {
    const { id } = req.params
    const { name, price, period, color, features } = req.body
    await query(
      'UPDATE subscription_plans SET name=$1,price=$2,period=$3,color=$4,features=$5,updated_at=NOW() WHERE id=$6',
      [name, price, period, color, JSON.stringify(features), id]
    )
    res.json({ success:true })
  } catch(e){ next(e) }
}

exports.getSubscription = async (req,res,next) => {
  try {
    const userId = req.params.userId || req.user.id
    await query(
      `UPDATE subscriptions SET status='expired' WHERE user_id=$1 AND status='active' AND expiry_date IS NOT NULL AND expiry_date < NOW()`,
      [userId]
    )
    const { rows } = await query(
      `SELECT s.*, p.name as plan_name, p.price as plan_price, p.color as plan_color
       FROM subscriptions s
       LEFT JOIN subscription_plans p ON p.id=s.plan_id
       WHERE s.user_id=$1 ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    )
    res.json(rows[0] || null)
  } catch(e){ next(e) }
}

exports.sendMessage = async (req,res,next) => {
  try {
    const { planId, planName, amount, phone, mpesaRef, message } = req.body
    const id = uuid()
    await query(
      `INSERT INTO payment_messages(id,user_id,user_name,user_role,plan_id,plan_name,amount,phone,mpesa_ref,message)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id,req.user.id,req.user.name,req.user.role,planId,planName,amount,phone,mpesaRef||null,message||null]
    )
    const admins = await query("SELECT id FROM users WHERE role='admin'")
    for(const a of admins.rows){
      await query(
        "INSERT INTO notifications(user_id,title,message,type) VALUES($1,$2,$3,'payment')",
        [a.id,'New Payment  '+planName, req.user.name+' paid KES '+amount+' for '+planName+'. Tap to confirm.']
      )
    }
    res.status(201).json({ success:true, id })
  } catch(e){ next(e) }
}

exports.getMessages = async (req,res,next) => {
  try {
    const { rows } = await query(
      `SELECT pm.*, u.email, u.phone as user_phone,
        COALESCE((SELECT json_agg(r.* ORDER BY r.created_at) FROM payment_message_replies r WHERE r.payment_message_id = pm.id), '[]') as replies
       FROM payment_messages pm
       LEFT JOIN users u ON u.id=pm.user_id
       ORDER BY pm.created_at DESC`
    )
    res.json(rows)
  } catch(e){ next(e) }
}

exports.confirmMessage = async (req,res,next) => {
  try {
    const msg = (await query('SELECT * FROM payment_messages WHERE id=$1',[req.params.id])).rows[0]
    if(!msg) return res.status(404).json({ error:'Not found' })
    await query(
      `INSERT INTO subscriptions(id,user_id,plan_id,plan_name,amount,status,start_date,expiry_date,last_payment_date)
       VALUES(gen_random_uuid(),$1,$2,$3,$4,'active',NOW(),NOW()+INTERVAL'30 days',NOW())
       ON CONFLICT(user_id) DO UPDATE
       SET plan_id=$2,plan_name=$3,amount=$4,status='active',
           start_date=NOW(),expiry_date=NOW()+INTERVAL'30 days',last_payment_date=NOW(),locked_at=NULL`,
      [msg.user_id,msg.plan_id,msg.plan_name,msg.amount]
    )
    await query("UPDATE payment_messages SET status='confirmed' WHERE id=$1",[req.params.id])
    await query(
      "INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Payment Confirmed!',$2,'payment')",
      [msg.user_id, 'Your ' + msg.plan_name + ' subscription is now active. Enjoy EduApp!']
    )
    try { notifyUser(msg.user_id, 'subscription:activated', { plan_name: msg.plan_name }) } catch(_) {}
    await query(
      "INSERT INTO logs(type,action,user_id,user_name,role,meta,timestamp) VALUES('admin','subscription_confirmed',$1,$2,$3,$4,NOW())",
      [req.user.id,req.user.name,req.user.role,JSON.stringify({for_user:msg.user_id,plan:msg.plan_name})]
    )
    res.json({ success:true })
  } catch(e){ next(e) }
}

exports.rejectMessage = async (req,res,next) => {
  try {
    const msg = (await query('SELECT * FROM payment_messages WHERE id=$1',[req.params.id])).rows[0]
    if(!msg) return res.status(404).json({ error:'Not found' })
    await query("UPDATE payment_messages SET status='rejected' WHERE id=$1",[req.params.id])
    await query(
      "INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Payment Issue','There was an issue with your payment. Please contact admin or try again.','payment')",
      [msg.user_id]
    )
    res.json({ success:true })
  } catch(e){ next(e) }
}

exports.lockUser = async (req,res,next) => {
  try {
    const { userId } = req.params
    await query(
      `INSERT INTO subscriptions(id,user_id,status,locked_at,created_at)
       VALUES(gen_random_uuid(),$1,'locked',NOW(),NOW())
       ON CONFLICT(user_id) DO UPDATE SET status='locked',locked_at=NOW()`,
      [userId]
    )
    await query(
      "INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Dashboard Locked','Your dashboard has been locked. Please renew your subscription to regain access.','system')",
      [userId]
    )
    await query(
      "INSERT INTO logs(type,action,user_id,user_name,role,meta,timestamp) VALUES('admin','user_locked',$1,$2,$3,$4,NOW())",
      [req.user.id,req.user.name,req.user.role,JSON.stringify({locked_user:userId})]
    )
  try { notifyUser(req.params.userId, 'subscription:locked', { reason: 'payment_required' }) } catch(_) {}
    res.json({ success:true })
  } catch(e){ next(e) }
}

exports.unlockUser = async (req,res,next) => {
  try {
    const { userId } = req.params
    await query("UPDATE subscriptions SET status='active',locked_at=NULL WHERE user_id=$1",[userId])
    await query(
      "INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Dashboard Unlocked','Your dashboard has been unlocked. Welcome back!','system')",
      [userId]
    )
  try { notifyUser(req.params.userId, 'subscription:unlocked', {}) } catch(_) {}
    res.json({ success:true })
  } catch(e){ next(e) }
}

exports.getAllSubscriptions = async (req,res,next) => {
  try {
    await query(
      `UPDATE subscriptions SET status='expired' WHERE status='active' AND expiry_date IS NOT NULL AND expiry_date < NOW()`
    )
    const { rows } = await query(
      `SELECT s.*, u.name, u.email, u.role, u.phone
       FROM subscriptions s LEFT JOIN users u ON u.id=s.user_id
       ORDER BY s.last_payment_date DESC NULLS LAST`
    )
    res.json(rows)
  } catch(e){ next(e) }
}

exports.lockSubscription = async (req,res,next) => {
  try {
    await query("UPDATE subscriptions SET status='locked' WHERE id=$1",[req.params.id])
    res.json({ message:'Locked.' })
  } catch(e){ next(e) }
}

exports.replyToMessage = async (req,res,next) => {
  try {
    const { id } = req.params
    const { message } = req.body
    if(!message || !message.trim()) return res.status(400).json({ error:'Message required' })
    const msg = (await query('SELECT * FROM payment_messages WHERE id=$1',[id])).rows[0]
    if(!msg) return res.status(404).json({ error:'Not found' })
    const replyId = uuid()
    await query(
      `INSERT INTO payment_message_replies(id,payment_message_id,sender_role,sender_name,message)
       VALUES($1,$2,'admin',$3,$4)`,
      [replyId, id, req.user.name, message.trim()]
    )
    await query(
      "INSERT INTO notifications(user_id,title,message,type) VALUES($1,'Support Reply','You have a new reply about your payment.','payment')",
      [msg.user_id]
    )
    try {
      notifyUser(msg.user_id, 'payment:reply', {
        id: replyId, payment_message_id: id, sender_role:'admin', sender_name: req.user.name,
        message: message.trim(), created_at: new Date()
      })
    } catch(_) {}
    res.status(201).json({ success:true, id: replyId })
  } catch(e){ next(e) }
}

exports.replyAsUser = async (req,res,next) => {
  try {
    const { id } = req.params
    const { message } = req.body
    if(!message || !message.trim()) return res.status(400).json({ error:'Message required' })
    const msg = (await query('SELECT * FROM payment_messages WHERE id=$1',[id])).rows[0]
    if(!msg) return res.status(404).json({ error:'Not found' })
    if(msg.user_id !== req.user.id) return res.status(403).json({ error:'Forbidden' })
    const replyId = uuid()
    await query(
      `INSERT INTO payment_message_replies(id,payment_message_id,sender_role,sender_name,message)
       VALUES($1,$2,'user',$3,$4)`,
      [replyId, id, req.user.name, message.trim()]
    )
    const admins = await query("SELECT id FROM users WHERE role='admin'")
    for(const a of admins.rows){
      try { notifyUser(a.id, 'payment:reply', {
        id: replyId, payment_message_id: id, sender_role:'user', sender_name: req.user.name,
        message: message.trim(), created_at: new Date(), user_id: msg.user_id
      }) } catch(_) {}
    }
    res.status(201).json({ success:true, id: replyId })
  } catch(e){ next(e) }
}