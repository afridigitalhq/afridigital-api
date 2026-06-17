module.exports = function logger(req, res, next) {
  req.traceId = Math.random().toString(36).slice(2, 10);

  console.log(`🧾 [${req.traceId}] ${req.method} ${req.path}`);

  next();
};
