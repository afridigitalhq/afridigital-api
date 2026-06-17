const bus = require("../events/eventBus");

function attachWhatsAppBridge(router) {
  router.post("/", (req, res) => {
    bus.emit("whatsapp.message", {
      body: req.body,
      ts: Date.now()
    });

    return res.json({ ok: true, queued: true });
  });
}

module.exports = { attachWhatsAppBridge };
