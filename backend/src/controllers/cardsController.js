const { v4: uuid } = require('uuid');
const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

exports.createCard = async (req, res, next) => {
  try {
    const { grade, subject, skillId, title, objective, modelText,
            practiceSpec, checkItems, variantUrls, difficulty, tags, locale } = req.body;
    const id = uuid();
    await query(
      `INSERT INTO cards(id,grade,subject,skill_id,title,objective,model_text,
        practice_spec,check_items,variant_urls,difficulty,tags,locale,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [id, grade, subject, skillId, title, objective, modelText,
       practiceSpec, JSON.stringify(checkItems), JSON.stringify(variantUrls || {}),
       difficulty || 1, JSON.stringify(tags || []), locale || 'en', req.user.id]
    );
    res.status(201).json({ id, message: 'Card created.' });
  } catch (e) { next(e); }
};

exports.listCards = async (req, res, next) => {
  try {
    const { grade, subject, tag } = req.query;
    let sql = 'SELECT * FROM cards WHERE 1=1';
    const params = [];
    if (grade)   { params.push(grade);   sql += ` AND grade=$${params.length}`; }
    if (subject) { params.push(subject); sql += ` AND subject=$${params.length}`; }
    if (tag)     { params.push(tag);     sql += ` AND tags @> $${params.length}::jsonb`; }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getCard = async (req, res, next) => {
  try {
    const variant = req.query.variant || 'full';
    const { rows } = await query('SELECT * FROM cards WHERE id=$1', [req.params.id]);
    if (!rows.length) return next(new AppError('Card not found', 404));
    const card = rows[0];
    const urls = typeof card.variant_urls === 'string'
      ? JSON.parse(card.variant_urls) : card.variant_urls;
    res.json({ ...card, assetUrl: urls[variant] || urls['full'] });
  } catch (e) { next(e); }
};

exports.updateCard = async (req, res, next) => {
  try {
    const { title, objective, modelText, practiceSpec, checkItems,
            variantUrls, difficulty, tags } = req.body;
    await query(
      `UPDATE cards SET title=$1,objective=$2,model_text=$3,practice_spec=$4,
       check_items=$5,variant_urls=$6,difficulty=$7,tags=$8 WHERE id=$9`,
      [title, objective, modelText, practiceSpec,
       JSON.stringify(checkItems), JSON.stringify(variantUrls || {}),
       difficulty, JSON.stringify(tags || []), req.params.id]
    );
    res.json({ message: 'Card updated.' });
  } catch (e) { next(e); }
};

exports.deleteCard = async (req, res, next) => {
  try {
    await query('DELETE FROM cards WHERE id=$1', [req.params.id]);
    res.json({ message: 'Card deleted.' });
  } catch (e) { next(e); }
};
