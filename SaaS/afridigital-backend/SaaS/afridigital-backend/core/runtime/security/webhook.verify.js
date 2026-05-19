/**
 * 🔐 A3.18.24 WEBHOOK VERIFICATION LAYER
 * Protects WhatsApp AI from spoofed requests
 */

const crypto = require("crypto");

/**
 * VERIFY META SIGNATURE
 */
function verifySignature(payload, signature, appSecret) {

  if (!signature || !appSecret) return false;

  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(payload, "utf8")
    .digest("hex");

  const received = signature.replace("sha256=", "");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(received)
  );
}

/**
 * VERIFY WEBHOOK HANDSHAKE (Meta setup step)
 */
function verifyChallenge(req, res, verifyToken) {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

/**
 * SAFE REQUEST GUARD
 */
function validateWebhook(req, appSecret, verifyToken) {

  const signature = req.headers["x-hub-signature-256"];

  const rawBody = JSON.stringify(req.body);

  const valid = verifySignature(rawBody, signature, appSecret);

  if (!valid) {
    return {
      ok: false,
      reason: "INVALID_SIGNATURE"
    };
  }

  return {
    ok: true
  };
}

module.exports = {
  verifySignature,
  verifyChallenge,
  validateWebhook
};
