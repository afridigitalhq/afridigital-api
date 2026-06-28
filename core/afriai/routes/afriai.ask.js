module.exports = function registerAfriAIRoute(app) {
  if (!app) return;

  app.post("/api/afriai/ask", (req, res) => {
    const message = req.body?.message || "";

    return res.json({
      success: true,
      afriai: {
        intent: "GENERAL_CHAT",
        reply: "AfriAI interaction layer active (read-only v1)",
        input: message,
        ts: Date.now()
      }
    });
  });
};
