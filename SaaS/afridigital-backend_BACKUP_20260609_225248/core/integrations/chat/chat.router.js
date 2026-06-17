/**
 * 📡 CHAT ROUTER (WHATSAPP ENTRYPOINT EXTENSION)
 */

const { ingestWhatsApp } = require("./chat.ingest");
const { handleAIFlow } = require("../../ai/whatsapp/ai.reply.engine");

function attachChatFlow(app, useAI = false) {
  app.post("/chat/webhook", async (req, res) => {
    try {
      const entry = req.body.entry?.[0];
      const msg = entry?.changes?.[0]?.value?.messages?.[0];

      if (!msg) return res.sendStatus(200);

      const event = {
        from: msg.from,
        text: msg.text?.body
      };

      if (useAI) {
        await handleAIFlow(event);
      } else {
        ingestWhatsApp(event);
      }

      return res.sendStatus(200);
    } catch (e) {
      console.error("Chat webhook error:", e.message);
      return res.sendStatus(200);
    }
  });
}

module.exports = {
  attachChatFlow
};
