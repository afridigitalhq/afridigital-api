module.exports = (err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);

  res.status(500).json({
    ok: false,
    error: err.message,
    trace: err.stack
  });
};
