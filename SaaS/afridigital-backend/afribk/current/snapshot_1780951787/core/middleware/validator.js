module.exports = function validator(req, res, next) {
  if (req.method === 'POST' && !req.body) {
    return res.status(400).json({
      ok: false,
      error: 'missing_body'
    });
  }

  next();
};
