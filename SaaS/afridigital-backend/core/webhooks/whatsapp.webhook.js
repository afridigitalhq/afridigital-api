const { enqueueMessage } = require("../queue/message.queue");

async function webhook(req, res) {
  try {
    const msg =
      req?.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (msg) {
      enqueueMessage({
        from: msg.from,
        text: msg.text?.body || "",
        ts: Date.now()
      });
    }

    res.sendStatus(200); // ALWAYS FAST RETURN
  } catch (e) {
    console.error("Webhook error:", e);
    res.sendStatus(200);
  }
}

module.exports = { webhook };
