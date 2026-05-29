module.exports = function errorHandler(err, req, res, next) {
  console.error(`🔥 [${req.traceId || 'no-trace'}]`, err);

  res.status(500).json({
    ok: false,
    error: 'internal_error',
    traceId: req.traceId
  });
};
