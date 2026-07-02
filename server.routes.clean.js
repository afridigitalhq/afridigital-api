module.exports = function attachRoutes(app, deps) {
  const {
    getInbox,
    reviewPR,
    executeApprovedPR,
    getEvents,
    replay,
    getInsights,
    getState,
    getAttackTopology
  } = deps;

  /* ================= HEALTH ================= */
  app.get("/health", (_, res) => {
    res.json({
      ok: true,
      kernel: "v4-clean",
      service: "afridigital-api"
    });
  });

  /* ================= WHATSAPP ================= */
  app.get("/api/whatsapp/inbox", (req, res) => {
    const role = req.query.role || "VIEWER";
    res.json(getInbox(role));
  });

  app.post("/api/whatsapp/pr/action", (req, res) => {
    try {
      const { prId, reviewerId } = req.body;

      const pr = reviewPR({
        prId,
        reviewerId,
        action: "APPROVE"
      });

      const result = executeApprovedPR(pr);

      res.json({ status: pr.status, pr, result });
    } catch (e) {
      res.status(500).json({ error: "PR_ACTION_FAILED" });
    }
  });

  /* ================= EVENTS ================= */
  app.get("/api/events", (_, res) => {
    res.json({ ok: true, events: getEvents() });
  });

  app.get("/api/events/history", (req, res) => {
    const from = parseInt(req.query.from || "0");
    const to = parseInt(req.query.to || "999999");
    res.json({ ok: true, events: replay(from, to) });
  });

  app.get("/api/events/insights", (_, res) => {
    res.json({ ok: true, insights: getInsights() });
  });

  /* ================= CI ================= */
  app.get("/api/ci/state", (_, res) => {
    res.json(getState());
  });

  /* ================= INTELLIGENCE ================= */
  app.get("/api/topology", (_, res) => {
    res.json({ ok: true, topology: getAttackTopology() });
  });
};
