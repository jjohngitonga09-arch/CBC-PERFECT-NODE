const router = require('express').Router();
const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const C = require('../controllers/paymentsController');

router.post('/checkout', authenticate, C.checkout);
// Stripe webhooks need raw body
router.post('/webhook',  express.raw({ type: 'application/json' }), C.webhook);

module.exports = router;
