const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { query } = require('../config/db');

// Lightweight status check - works even when account is locked
router.get('/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ status: 'unknown' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query('SELECT status FROM users WHERE id=$1', [decoded.id]);
    res.json({ status: rows[0]?.status || 'unknown' });
  } catch {
    res.json({ status: 'unknown' });
  }
});

module.exports = router;
