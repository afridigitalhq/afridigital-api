function trace(req, meta = {}) {
  const id = req?.streamId || Math.random().toString(36).slice(2, 10);

  const log = {
    traceId: id,
    apiKey: req?.apiKey || "anon",
    input: req?.text,
    meta,
    ts: Date.now()
  };

  console.log("[TRACE]", JSON.stringify(log));

  return id;
}

module.exports = { trace };
