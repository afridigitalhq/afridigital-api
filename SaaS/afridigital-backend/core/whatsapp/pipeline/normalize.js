module.exports = function normalize(req) {
  return {
    text: req.body?.text || "",
    from: req.body?.from || "unknown",
    raw: req.body || {}
  };
};
