const AppError = require('../utils/AppError');

function validateCard(req, res, next) {
  const { objective, modelText, practiceSpec, checkItems } = req.body;

  if (!objective || !modelText || !practiceSpec)
    return next(new AppError('Card requires objective, modelText, and practiceSpec', 400));

  const wordCount = modelText.trim().split(/\s+/).length;
  if (wordCount > 120)
    return next(new AppError(`modelText exceeds 120 words (got ${wordCount})`, 400));

  if (!Array.isArray(checkItems) || checkItems.length < 1 || checkItems.length > 3)
    return next(new AppError('checkItems must have 1–3 items', 400));

  next();
}

module.exports = { validateCard };
