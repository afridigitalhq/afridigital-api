module.exports = (err, req, res, next) => {
  console.error('🔥 ERROR:', err);
  res.status(500).json({
    ok: false,
    error: 'internal_error',
    message: err.message
  });
};
