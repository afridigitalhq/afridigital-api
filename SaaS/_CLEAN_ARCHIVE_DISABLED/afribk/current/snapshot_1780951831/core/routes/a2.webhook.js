const queue = require("../queue/a2Queue.persist");

module.exports = function attachA2(app) {
  app.post("/webhook/whatsapp", async (req, res) => {
    try {
      const job = queue.add({
        text: req.body?.text || "",
        to: req.body?.to || "mock"
      });

      return res.json({
        ok: true,
        engine: "A2-v1.3",
        queued: true,
        id: job.id,
        queueSize: queue.size()
      });

    } catch (e) {
      return res.status(500).json({
        ok: false,
        error: e.message
      });
    }
  });
};
