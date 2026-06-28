
module.exports = function mountAfriAIUI(app, ws) {
  if (!app) return;

  app.get("/api/afriai/ui", (req, res) => {
    res.json({
      status: "active",
      mode: "dashboard-chat-ready"
    });
  });
};
