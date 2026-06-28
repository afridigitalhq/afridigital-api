module.exports = (app) => {
  app.post("/api/afriai/ask", (req, res) => {
    const { message } = req.body || {};
    res.json({
      ok: true,
      layer: "afriai-v1",
      reply: "AfriAI bridge active (read-only mode)",
      input: message || null
    });
  });
};
