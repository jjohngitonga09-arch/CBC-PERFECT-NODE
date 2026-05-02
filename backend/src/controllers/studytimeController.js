const { query } = require('../config/db');

exports.markVisited = async (req, res) => {
  try {
    const { grade, subject, topic } = req.body;
    await query(
      `INSERT INTO studytime_progress(user_id,grade,subject,topic) VALUES($1,$2,$3,$4)
       ON CONFLICT(user_id,grade,subject,topic) DO UPDATE SET visited_at=NOW()`,
      [req.user.id, grade, subject, topic]
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.getAllProgress = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT grade,subject,topic FROM studytime_progress WHERE user_id=$1`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.toggleFavourite = async (req, res) => {
  try {
    const { grade, subject, topic } = req.body;
    const { rows } = await query(
      `SELECT id FROM studytime_favourites WHERE user_id=$1 AND grade=$2 AND subject=$3 AND topic=$4`,
      [req.user.id, grade, subject, topic]
    );
    if (rows.length > 0) {
      await query(`DELETE FROM studytime_favourites WHERE id=$1`, [rows[0].id]);
      res.json({ favourited: false });
    } else {
      await query(
        `INSERT INTO studytime_favourites(user_id,grade,subject,topic) VALUES($1,$2,$3,$4)`,
        [req.user.id, grade, subject, topic]
      );
      res.json({ favourited: true });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.getFavourites = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT grade,subject,topic,created_at FROM studytime_favourites WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.saveQuizResult = async (req, res) => {
  try {
    const { grade, subject, topic, score, total } = req.body;
    await query(
      `INSERT INTO studytime_quiz_results(user_id,grade,subject,topic,score,total) VALUES($1,$2,$3,$4,$5,$6)`,
      [req.user.id, grade, subject, topic, score, total]
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.getBestScore = async (req, res) => {
  try {
    const { grade, subject, topic } = req.params;
    const { rows } = await query(
      `SELECT score,total FROM studytime_quiz_results WHERE user_id=$1 AND grade=$2 AND subject=$3 AND topic=$4 ORDER BY score DESC LIMIT 1`,
      [req.user.id, grade, subject, topic]
    );
    res.json(rows[0] || null);
  } catch(e) { res.status(500).json({ error: e.message }); }
};

exports.getAllQuizResults = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT grade,subject,topic,MAX(score) as best_score,total FROM studytime_quiz_results WHERE user_id=$1 GROUP BY grade,subject,topic,total`,
      [req.user.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
};
