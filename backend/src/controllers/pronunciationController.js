const { query } = require('../config/db');

exports.getPronunciation = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, title, variant_urls FROM cards WHERE id=$1', [req.params.cardId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Card not found' });
    const urls = typeof rows[0].variant_urls === 'string'
      ? JSON.parse(rows[0].variant_urls) : rows[0].variant_urls;
    res.json({ cardId: rows[0].id, title: rows[0].title, audioUrl: urls?.audio || null });
  } catch (e) { next(e); }
};

exports.scorePractice = async (req, res, next) => {
  // Placeholder: integrate with an ASR service (e.g. Google Speech-to-Text)
  res.json({ score: Math.floor(60 + Math.random() * 40), message: 'Practice scored (mock).' });
};
