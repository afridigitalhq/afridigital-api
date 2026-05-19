const brain = require('./core/brain');
const delivery = require('./core/delivery/deliveryEngine');
const { lock, unlock } = require('../../core/brain/v3/responseLock');

function extractMessage(body) {
  return body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
}

module.exports = async (req, res) => {
  try {
    const msg = extractMessage(req.body);

    if (!msg || !msg.from) {
      return res.status(400).json({ ok: false, error: "INVALID_PAYLOAD" });
    }

    const messageId = msg.id || msg.timestamp;
    const to = msg.from;

    if (!lock(messageId)) {
      return res.json({ ok: true, skipped: "duplicate_message" });
    }

    const { reply } = await brain.processMessage(
      { body: { message: msg.text?.body, from: to } },
      res
    );

    if (reply) {
      await delivery.deliver(to, reply);
    }

    unlock(messageId);

    return res.json({
      ok: true,
      delivered: true
    });

  } catch (e) {
    console.error("🔥 WEBHOOK_ERROR:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
};
