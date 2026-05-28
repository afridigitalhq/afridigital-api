const crypto = require("crypto");
const idempotency = require("../runtime/state/idempotency");

function verifySignature(req) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  const signature = req.headers["x-hub-signature-256"];

  if (!secret || !signature) return false;

  const payload = JSON.stringify(req.body);
  const expected = "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

function isReplay(msgId) {
  if (!msgId) return true;
  if (idempotency.has(msgId)) return true;

  idempotency.mark(msgId);
  return false;
}

function extractMessage(req) {
  return req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
}

module.exports = {
  validate(req) {
    const msg = extractMessage(req);
    if (!msg) return { ok: false, reason: "no_message" };

    if (!verifySignature(req)) {
      return { ok: false, reason: "invalid_signature" };
    }

    if (isReplay(msg.id)) {
      return { ok: false, reason: "replay_detected" };
    }

    return {
      ok: true,
      event: {
        type: "whatsapp.message",
        id: msg.id,
        from: msg.from,
        text: msg.text?.body || ""
      }
    };
  }
};
