/**
 * 🔵 RENDER WEBHOOK ROUTE (attach to server.js if needed)
 */

const { handleRenderEvent } = require("./ci.receiver");

function attachRenderWebhook(app) {
  app.post("/render/webhook", (req, res) => {
    try {
      const log = req.body || {};
      handleRenderEvent(log);
      return res.sendStatus(200);
    } catch (e) {
      console.error("Render webhook error:", e.message);
      return res.sendStatus(200);
    }
  });
}

module.exports = {
  attachRenderWebhook
};
