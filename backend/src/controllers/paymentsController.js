const stripe   = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const logger   = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.checkout = async (req, res, next) => {
  try {
    const { plan, successUrl, cancelUrl } = req.body;
    const prices = { monthly: 'price_monthly', annual: 'price_annual' };
    if (!prices[plan]) return next(new AppError('Invalid plan', 400));

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: prices[plan], quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/parent/subscription?success=1`,
      cancel_url:  cancelUrl  || `${process.env.FRONTEND_URL}/parent/subscription`,
      metadata: { userId: req.user.id, plan },
    });
    res.json({ url: session.url });
  } catch (e) { next(e); }
};

exports.webhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;
    await query(
      `INSERT INTO subscriptions(id,user_id,plan,status,start_date,expiry_date,last_payment_date,amount)
       VALUES($1,$2,$3,'active',NOW(),NOW()+INTERVAL'30 days',NOW(),$4)
       ON CONFLICT(user_id) DO UPDATE
       SET status='active', plan=$3, last_payment_date=NOW(), expiry_date=NOW()+INTERVAL'30 days'`,
      [uuid(), userId, plan, session.amount_total / 100]
    );
    logger.info(`Subscription activated for user ${userId}`);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    logger.warn(`Payment failed: ${JSON.stringify(invoice)}`);
  }

  res.json({ received: true });
};
